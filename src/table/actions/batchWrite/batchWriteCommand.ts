import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { BatchDeleteRequest } from '~/entity/actions/batchDelete/index.js'
import type { BatchPutRequest } from '~/entity/actions/batchPut/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table } from '~/table/index.js'
import type { ListOf } from '~/types/listOf.js'

import { $options, $requests } from './constants.js'

export type BatchWriteRequestProps = Pick<BatchPutRequest | BatchDeleteRequest, 'entity' | 'params'>

export type BatchWriteCommandOptions = {
  tableName?: string
}

type RequestEntities<
  REQUESTS extends BatchWriteRequestProps[],
  RESULTS extends Entity[] = []
> = number extends REQUESTS['length']
  ? ListOf<REQUESTS[number]> extends BatchWriteRequestProps[]
    ? RequestEntities<ListOf<REQUESTS[number]>>
    : never
  : REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
    ? REQUESTS_HEAD extends BatchWriteRequestProps
      ? REQUESTS_TAIL extends BatchWriteRequestProps[]
        ? REQUESTS_HEAD['entity']['name'] extends RESULTS[number]['name']
          ? RequestEntities<REQUESTS_TAIL, RESULTS>
          : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD['entity']]>
        : never
      : never
    : RESULTS

export class BatchWriteCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  REQUESTS extends BatchWriteRequestProps[] = BatchWriteRequestProps[]
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'batchWrite' as const;

  [$requests]?: REQUESTS;
  [$options]: BatchWriteCommandOptions

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    requests?: REQUESTS,
    options: BatchWriteCommandOptions = {}
  ) {
    super(table, entities)
    this[$requests] = requests
    this[$options] = options
  }

  requests<NEXT_REQUESTS extends BatchWriteRequestProps[]>(
    ...requests: NEXT_REQUESTS
  ): BatchWriteCommand<TABLE, RequestEntities<NEXT_REQUESTS>, NEXT_REQUESTS> {
    const entities: Entity[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request.entity.name)) {
        continue
      }
      entities.push(request.entity)
      entityNames.add(request.entity.name)
    }

    return new BatchWriteCommand(this.table, entities as RequestEntities<NEXT_REQUESTS>, requests)
  }

  options(nextOptions: BatchWriteCommandOptions): BatchWriteCommand<TABLE, ENTITIES, REQUESTS> {
    return new BatchWriteCommand(this.table, this[$entities], this[$requests], nextOptions)
  }

  params(): NonNullable<NonNullable<BatchWriteCommandInput>['RequestItems']> {
    if (this[$requests] === undefined || this[$requests].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchWriteCommand incomplete: No BatchWriteRequest supplied'
      })
    }

    const { tableName, ...extraOptions } = this[$options] ?? {}
    rejectExtraOptions(extraOptions)

    if (tableName) {
      parseTableNameOption(tableName)
    }

    return {
      [tableName ?? this.table.getName()]: this[$requests].map(request => request.params())
    }
  }
}
