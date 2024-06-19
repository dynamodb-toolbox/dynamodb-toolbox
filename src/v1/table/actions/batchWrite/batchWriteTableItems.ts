import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError } from 'v1/errors'
import { TableV2, TableAction, $table } from 'v1/table'
import { EntityV2, $entity } from 'v1/entity'
import type { BatchPutItemRequest } from 'v1/entity/actions/batchPut'
import type { BatchDeleteItemRequest } from 'v1/entity/actions/batchDelete'

export const $requests = Symbol('$requests')
export type $requests = typeof $requests

export type BatchWriteItemRequestProps = Pick<
  BatchPutItemRequest | BatchDeleteItemRequest,
  $entity | 'params'
>

type RequestEntities<
  REQUESTS extends BatchWriteItemRequestProps[],
  RESULTS extends EntityV2[] = []
> = REQUESTS extends [infer REQUESTS_HEAD, ...infer REQUESTS_TAIL]
  ? REQUESTS_HEAD extends BatchWriteItemRequestProps
    ? REQUESTS_TAIL extends BatchWriteItemRequestProps[]
      ? REQUESTS_HEAD[$entity]['name'] extends RESULTS[number]['name']
        ? RequestEntities<REQUESTS_TAIL, RESULTS>
        : RequestEntities<REQUESTS_TAIL, [...RESULTS, REQUESTS_HEAD[$entity]]>
      : never
    : never
  : RESULTS

export class BatchWriteTableItemsRequest<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[],
  REQUESTS extends BatchWriteItemRequestProps[] = BatchWriteItemRequestProps[]
> extends TableAction<TABLE, ENTITIES> {
  static actionName = 'batchWrite' as const;

  [$requests]?: REQUESTS

  constructor(table: TABLE, entities = ([] as unknown) as ENTITIES, requests?: REQUESTS) {
    super(table, entities)
    this[$requests] = requests
  }

  requests<NEXT_REQUESTS extends BatchWriteItemRequestProps[]>(
    ...requests: NEXT_REQUESTS
  ): BatchWriteTableItemsRequest<TABLE, RequestEntities<NEXT_REQUESTS>, NEXT_REQUESTS> {
    const entities: EntityV2[] = []
    const entityNames = new Set<string>()

    for (const request of requests) {
      if (entityNames.has(request[$entity].name)) {
        continue
      }
      entities.push(request[$entity])
      entityNames.add(request[$entity].name)
    }

    return new BatchWriteTableItemsRequest(
      this[$table],
      entities as RequestEntities<NEXT_REQUESTS>,
      requests
    )
  }

  params(): NonNullable<NonNullable<BatchWriteCommandInput>['RequestItems']>[string] {
    if (this[$requests] === undefined || this[$requests].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'BatchWriteTableItemsRequest incomplete: No batchWriteItemRequest supplied'
      })
    }

    return this[$requests].map(request => request.params())
  }
}
