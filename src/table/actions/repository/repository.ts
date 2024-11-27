import type { BatchWriteCommandOutput } from '@aws-sdk/lib-dynamodb'

import { BatchDeleteRequest } from '~/entity/actions/batchDelete/batchDeleteRequest.js'
import { BatchGetRequest } from '~/entity/actions/batchGet/batchGetRequest.js'
import { BatchPutRequest } from '~/entity/actions/batchPut/batchPutRequest.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { RequestEntities as BatchGetRequestEntities } from '~/table/actions/batchGet/batchGetCommand.js'
import type {
  BatchGetCommandOptions,
  ExecuteBatchGetInput,
  ExecuteBatchGetResponses
} from '~/table/actions/batchGet/index.js'
import { BatchGetCommand, execute as executeBatchGet } from '~/table/actions/batchGet/index.js'
import type {
  BatchWriteCommandOptions,
  RequestEntities as BatchWriteRequestEntities,
  BatchWriteRequestProps
} from '~/table/actions/batchWrite/batchWriteCommand.js'
import {
  BatchWriteCommand,
  execute as executeBatchWrite
} from '~/table/actions/batchWrite/index.js'
import type { ExecuteBatchWriteInput } from '~/table/actions/batchWrite/index.js'
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

const isBatchWriteRequest = (
  input: BatchWriteCommandOptions | BatchWriteRequestProps
): input is BatchWriteRequestProps =>
  input instanceof BatchPutRequest || input instanceof BatchDeleteRequest

export class Repository<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[]
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'repository' as const

  constructor(table: TABLE, entities = [] as unknown as ENTITIES) {
    super(table, entities)
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): Repository<TABLE, NEXT_ENTITIES> {
    return new Repository<TABLE, NEXT_ENTITIES>(this.table, nextEntities)
  }

  parsePrimaryKey(keyInput: { [KEY: string]: unknown }): PrimaryKey<TABLE> {
    return new PrimaryKeyParser(this.table).parse(keyInput)
  }

  async scan<OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>>(
    options: OPTIONS = {} as OPTIONS
  ): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> {
    return new ScanCommand(this.table, this[$entities], options).send()
  }

  async query<
    QUERY extends Query<TABLE> = Query<TABLE>,
    OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
  >(
    query: QUERY,
    options: OPTIONS = {} as OPTIONS
  ): Promise<QueryResponse<TABLE, QUERY, ENTITIES, OPTIONS>> {
    return new QueryCommand(this.table, this[$entities], query, options).send()
  }

  async deletePartition<QUERY extends Query<TABLE> = Query<TABLE>>(
    query: QUERY,
    options: DeletePartitionOptions<TABLE, ENTITIES, QUERY> = {}
  ): Promise<DeletePartitionResponse> {
    return new DeletePartitionCommand(this.table, this[$entities], query, options).send()
  }

  static executeBatchGet<COMMANDS extends ExecuteBatchGetInput>(
    ...commands: COMMANDS
  ): Promise<ExecuteBatchGetResponses<COMMANDS>> {
    return executeBatchGet<COMMANDS>(...commands)
  }

  batchGet<
    REQUESTS_OR_OPTIONS extends BatchGetRequest[] | [BatchGetCommandOptions, ...BatchGetRequest[]],
    REQUESTS extends BatchGetRequest[] = REQUESTS_OR_OPTIONS extends BatchGetRequest[]
      ? REQUESTS_OR_OPTIONS
      : REQUESTS_OR_OPTIONS extends [BatchGetCommandOptions, ...infer TAIL_REQUESTS]
        ? TAIL_REQUESTS extends BatchGetRequest[]
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

    const requests = tailRequests as BatchGetRequest[]
    let options: BatchGetCommandOptions = {}

    if (headRequestOrOptions instanceof BatchGetRequest) {
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
      if (entityNames.has(request.entity.name)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.name)
    }

    return new BatchGetCommand<TABLE, REQUEST_ENTITIES, REQUESTS, OPTIONS>(
      this.table,
      entities as REQUEST_ENTITIES,
      requests as REQUESTS,
      options as OPTIONS
    )
  }

  static executeBatchWrite(...commands: ExecuteBatchWriteInput): Promise<BatchWriteCommandOutput> {
    return executeBatchWrite(...commands)
  }

  batchWrite<
    REQUESTS_OR_OPTIONS extends
      | BatchWriteRequestProps[]
      | [BatchWriteCommandOptions, ...BatchWriteRequestProps[]],
    REQUESTS extends BatchWriteRequestProps[] = REQUESTS_OR_OPTIONS extends BatchWriteRequestProps[]
      ? REQUESTS_OR_OPTIONS
      : REQUESTS_OR_OPTIONS extends [BatchWriteCommandOptions, ...infer TAIL_REQUESTS]
        ? TAIL_REQUESTS extends BatchWriteRequestProps[]
          ? TAIL_REQUESTS
          : never
        : never,
    REQUEST_ENTITIES extends Entity[] = BatchWriteRequestEntities<REQUESTS>
  >(..._requests: REQUESTS_OR_OPTIONS): BatchWriteCommand<TABLE, REQUEST_ENTITIES, REQUESTS> {
    const [headRequestOrOptions = {}, ...tailRequests] = _requests

    const requests = tailRequests as BatchWriteRequestProps[]
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
      if (entityNames.has(request.entity.name)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.name)
    }

    return new BatchWriteCommand<TABLE, REQUEST_ENTITIES, REQUESTS>(
      this.table,
      entities as REQUEST_ENTITIES,
      requests as REQUESTS,
      options
    )
  }
}
