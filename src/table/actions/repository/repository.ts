import type { BatchWriteCommandOutput } from '@aws-sdk/lib-dynamodb'

import { BatchDeleteRequest } from '~/entity/actions/batchDelete/batchDeleteRequest.js'
import { BatchGetRequest } from '~/entity/actions/batchGet/batchGetRequest.js'
import { BatchPutRequest } from '~/entity/actions/batchPut/batchPutRequest.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema, TransformedValue } from '~/schema/index.js'
import { AccessPattern } from '~/table/actions/accessPattern/index.js'
import type { RequestEntities as BatchGetRequestEntities } from '~/table/actions/batchGet/batchGetCommand.js'
import type {
  BatchGetCommandOptions,
  ExecuteBatchGetInput,
  ExecuteBatchGetResponses,
  IBatchGetRequest
} from '~/table/actions/batchGet/index.js'
import { BatchGetCommand, execute as executeBatchGet } from '~/table/actions/batchGet/index.js'
import type {
  BatchWriteCommandOptions,
  RequestEntities as BatchWriteRequestEntities,
  ExecuteBatchWriteInput,
  IBatchWriteRequest
} from '~/table/actions/batchWrite/index.js'
import {
  BatchWriteCommand,
  execute as executeBatchWrite
} from '~/table/actions/batchWrite/index.js'
import type {
  DeletePartitionOptions,
  DeletePartitionResponse
} from '~/table/actions/deletePartition/index.js'
import { DeletePartitionCommand } from '~/table/actions/deletePartition/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'
import { PrimaryKeyParser } from '~/table/actions/parsePrimaryKey/index.js'
import type { Query, QueryOptions, QueryResponse } from '~/table/actions/query/index.js'
import { QueryCommand } from '~/table/actions/query/index.js'
import type { ScanOptions, ScanResponse } from '~/table/actions/scan/index.js'
import { ScanCommand } from '~/table/actions/scan/index.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

/** Convenience wrapper exposing a table's actions as plain methods. */
export class TableRepository<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[]
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'repository' as const

  /** Bind the repository to a table and entities. */
  constructor(table: TABLE, entities = [] as unknown as ENTITIES) {
    super(table, entities)
  }

  /** Set the entities the repository spans. */
  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): TableRepository<TABLE, NEXT_ENTITIES> {
    return new TableRepository<TABLE, NEXT_ENTITIES>(this.table, nextEntities)
  }

  /** Validate and extract the table's primary key from a key input. */
  parsePrimaryKey(keyInput: { [KEY: string]: unknown }): PrimaryKey<TABLE> {
    return new PrimaryKeyParser(this.table).parse(keyInput)
  }

  /** Scan the table (or an index) and return the formatted response. */
  async scan<OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>>(
    options: OPTIONS = {} as OPTIONS
  ): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> {
    return new ScanCommand(this.table, this[$entities], options).send()
  }

  /** Query a partition (primary key or index) and return the formatted response. */
  async query<
    QUERY extends Query<TABLE> = Query<TABLE>,
    OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
  >(
    query: QUERY,
    options: OPTIONS = {} as OPTIONS
  ): Promise<QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>> {
    return new QueryCommand(this.table, this[$entities], query, options).send()
  }

  /** Query a partition then batch-delete every matched item. */
  async deletePartition<QUERY extends Query<TABLE> = Query<TABLE>>(
    query: QUERY,
    options: DeletePartitionOptions<TABLE, ENTITIES, QUERY> = {}
  ): Promise<DeletePartitionResponse> {
    return new DeletePartitionCommand(this.table, this[$entities], query, options).send()
  }

  /** Run one or more `BatchGetCommand`s, paginating and retrying unprocessed keys. */
  static executeBatchGet<COMMANDS extends ExecuteBatchGetInput>(
    ...commands: COMMANDS
  ): Promise<ExecuteBatchGetResponses<COMMANDS>> {
    return executeBatchGet<COMMANDS>(...commands)
  }

  /** Assemble entity `BatchGetRequest`s (optionally led by options) into a `BatchGetCommand`. */
  batchGet<
    REQUESTS_OR_OPTIONS extends
      | IBatchGetRequest[]
      | [BatchGetCommandOptions, ...IBatchGetRequest[]],
    REQUESTS extends IBatchGetRequest[] = REQUESTS_OR_OPTIONS extends IBatchGetRequest[]
      ? REQUESTS_OR_OPTIONS
      : REQUESTS_OR_OPTIONS extends [BatchGetCommandOptions, ...infer TAIL_REQUESTS]
        ? TAIL_REQUESTS extends IBatchGetRequest[]
          ? TAIL_REQUESTS
          : never
        : never,
    REQUEST_ENTITIES extends Entity[] = BatchGetRequestEntities<REQUESTS>,
    OPTIONS extends BatchGetCommandOptions<REQUEST_ENTITIES> = REQUESTS_OR_OPTIONS extends [
      BatchGetCommandOptions<REQUEST_ENTITIES>
    ]
      ? REQUESTS_OR_OPTIONS[0]
      : BatchGetCommandOptions<REQUEST_ENTITIES>
  >(
    ..._requests: REQUESTS_OR_OPTIONS
  ): BatchGetCommand<TABLE, REQUEST_ENTITIES, REQUESTS, OPTIONS> {
    const [headRequestOrOptions = {}, ...tailRequests] = _requests

    const requests = tailRequests as IBatchGetRequest[]
    let options: BatchGetCommandOptions = {}

    if (isBatchGetRequest(headRequestOrOptions)) {
      requests.unshift(headRequestOrOptions)
    } else {
      options = headRequestOrOptions
    }

    const firstRequest = requests[0]
    if (firstRequest === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'batchGet incomplete: No BatchGetRequest supplied'
      })
    }

    const entities: Entity[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request.entity.entityName)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.entityName)
    }

    return new BatchGetCommand<TABLE, REQUEST_ENTITIES, REQUESTS, OPTIONS>(
      this.table,
      entities as REQUEST_ENTITIES,
      requests as REQUESTS,
      options as OPTIONS
    )
  }

  /** Run one or more `BatchWriteCommand`s, paginating and retrying unprocessed items. */
  static executeBatchWrite(...commands: ExecuteBatchWriteInput): Promise<BatchWriteCommandOutput> {
    return executeBatchWrite(...commands)
  }

  /** Assemble entity batch put/delete requests (optionally led by options) into a `BatchWriteCommand`. */
  batchWrite<
    REQUESTS_OR_OPTIONS extends
      | IBatchWriteRequest[]
      | [BatchWriteCommandOptions, ...IBatchWriteRequest[]],
    REQUESTS extends IBatchWriteRequest[] = REQUESTS_OR_OPTIONS extends IBatchWriteRequest[]
      ? REQUESTS_OR_OPTIONS
      : REQUESTS_OR_OPTIONS extends [BatchWriteCommandOptions, ...infer TAIL_REQUESTS]
        ? TAIL_REQUESTS extends IBatchWriteRequest[]
          ? TAIL_REQUESTS
          : never
        : never,
    REQUEST_ENTITIES extends Entity[] = BatchWriteRequestEntities<REQUESTS>
  >(..._requests: REQUESTS_OR_OPTIONS): BatchWriteCommand<TABLE, REQUEST_ENTITIES, REQUESTS> {
    const [headRequestOrOptions = {}, ...tailRequests] = _requests

    const requests = tailRequests as IBatchWriteRequest[]
    let options: BatchWriteCommandOptions = {}

    if (isBatchWriteRequest(headRequestOrOptions)) {
      requests.unshift(headRequestOrOptions)
    } else {
      options = headRequestOrOptions
    }

    const firstRequest = requests[0]
    if (firstRequest === undefined) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'batchGet incomplete: No BatchWriteRequest supplied'
      })
    }

    const entities: Entity[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request.entity.entityName)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.entityName)
    }

    return new BatchWriteCommand<TABLE, REQUEST_ENTITIES, REQUESTS>(
      this.table,
      entities as REQUEST_ENTITIES,
      requests as REQUESTS,
      options
    )
  }

  /** Build a reusable `AccessPattern` from an input schema and a `query` transform. */
  accessPattern<
    SCHEMA extends Schema,
    QUERY extends Query<TABLE>,
    DEFAULT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
      TABLE,
      ENTITIES,
      QUERY
    >,
    CONTEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES, QUERY> = QueryOptions<
      TABLE,
      ENTITIES,
      QUERY
    >
  >(
    schema: SCHEMA,
    pattern: (input: TransformedValue<SCHEMA>) => QUERY & { options?: CONTEXT_OPTIONS },
    options: DEFAULT_OPTIONS = {} as DEFAULT_OPTIONS
  ): AccessPattern<TABLE, ENTITIES, SCHEMA, QUERY, DEFAULT_OPTIONS, CONTEXT_OPTIONS> {
    return new AccessPattern(
      this.table,
      this[$entities],
      schema,
      /**
       * @debt v3 "put query in a 'query' key so it's not polluted by the options"
       */
      pattern as any,
      options
    )
  }
}

const isBatchGetRequest = (
  input: BatchGetCommandOptions | IBatchWriteRequest
): input is IBatchGetRequest => input instanceof BatchGetRequest

const isBatchWriteRequest = (
  input: BatchWriteCommandOptions | IBatchWriteRequest
): input is IBatchWriteRequest =>
  input instanceof BatchPutRequest || input instanceof BatchDeleteRequest
