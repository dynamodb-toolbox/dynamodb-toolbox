import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import type { U } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors/index.js'
import { TableV2, TableAction, $table } from 'v1/table/index.js'
import { EntityV2, $entity } from 'v1/entity/index.js'
import type { BatchPutRequest } from 'v1/entity/actions/batchPut.js'
import type { BatchDeleteRequest } from 'v1/entity/actions/batchDelete.js'

export const $requests = Symbol('$requests')
export type $requests = typeof $requests

export type BatchWriteRequestProps = Pick<BatchPutRequest | BatchDeleteRequest, $entity | 'params'>

type RequestEntities<
  REQUESTS extends BatchWriteRequestProps[],
  RESULTS extends EntityV2[] = []
> = number extends REQUESTS['length']
  ? U.ListOf<REQUESTS[number]> extends BatchWriteRequestProps[]
    ? RequestEntities<U.ListOf<REQUESTS[number]>>
    : never
  : REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
  ? REQUESTS_HEAD extends BatchWriteRequestProps
    ? REQUESTS_TAIL extends BatchWriteRequestProps[]
      ? REQUESTS_HEAD[$entity]['name'] extends RESULTS[number]['name']
        ? RequestEntities<REQUESTS_TAIL, RESULTS>
        : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD[$entity]]>
      : never
    : never
  : RESULTS

export class BatchWriteCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  REQUESTS extends BatchWriteRequestProps[] = BatchWriteRequestProps[]
> extends TableAction<TABLE, ENTITIES> {
  static actionName = 'batchWrite' as const;

  [$requests]?: REQUESTS

  constructor(table: TABLE, entities = ([] as unknown) as ENTITIES, requests?: REQUESTS) {
    super(table, entities)
    this[$requests] = requests
  }

  requests<NEXT_REQUESTS extends BatchWriteRequestProps[]>(
    ...requests: NEXT_REQUESTS
  ): BatchWriteCommand<TABLE, RequestEntities<NEXT_REQUESTS>, NEXT_REQUESTS> {
    const entities: EntityV2[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request[$entity].name)) {
        continue
      }
      entities.push(request[$entity])
      entityNames.add(request[$entity].name)
    }

    return new BatchWriteCommand(this[$table], entities as RequestEntities<NEXT_REQUESTS>, requests)
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
