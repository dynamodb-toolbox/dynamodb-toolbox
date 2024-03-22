import type { EntityV2 } from 'v1/entity'
import type { PutItemInput } from 'v1/operations/putItem'
import { putItemParams } from 'v1/operations/putItem/putItemParams'
import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { BatchWriteItemRequest } from '../BatchWriteItemRequest'
import { $requestType } from '../BatchWriteItemRequest'

export const $item = Symbol('$item')

export class BatchPutItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityOperation<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'PutRequest'> {
  static operationName = 'putBatch' as const;

  [$item]?: PutItemInput<ENTITY>

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>) {
    super(entity)
    this[$item] = item
  }

  [$requestType] = 'PutRequest' as const

  item(nextItem: PutItemInput<ENTITY>): BatchPutItemRequest<ENTITY> {
    return new BatchPutItemRequest(this[$entity], nextItem)
  }

  params() {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'PutBatchItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item])
  }
}
