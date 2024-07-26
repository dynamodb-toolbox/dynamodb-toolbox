import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { BatchDeleteRequest } from '~/entity/actions/batchDelete/index.js'
import type { BatchPutRequest } from '~/entity/actions/batchPut/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { TableAction } from '~/table/index.js'
import type { Table } from '~/table/index.js'
import type { ListOf } from '~/types/listOf.js'

import { $requests } from './constants.js'

export type BatchWriteRequestProps = Pick<BatchPutRequest | BatchDeleteRequest, 'entity' | 'params'>

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
  static actionName = 'batchWrite' as const;

  [$requests]?: REQUESTS

  constructor(table: TABLE, entities = [] as unknown as ENTITIES, requests?: REQUESTS) {
    super(table, entities)
    this[$requests] = requests
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

  params(): NonNullable<NonNullable<BatchWriteCommandInput>['RequestItems']>[string] {
    if (this[$requests] === undefined || this[$requests].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchWriteCommand incomplete: No BatchWriteRequest supplied'
      })
    }

    return this[$requests].map(request => request.params())
  }
}
