import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import type { PutItemInput } from 'v1/operations/putItem'
import { putItemParams } from 'v1/operations/putItem/putItemParams'

import { $entity, EntityOperation } from '../../class'
import type { BatchWriteItemRequest } from '../BatchWriteItemRequest'

export const $item = Symbol('$item')

export class BatchPutItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityOperation<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'PutRequest'> {
  static operationName = 'putBatch' as const;

  [$item]?: PutItemInput<ENTITY>
  item: (nextItem: PutItemInput<ENTITY>) => BatchPutItemRequest<ENTITY>

  constructor(entity: ENTITY, item?: PutItemInput<ENTITY>) {
    super(entity)
    this[$item] = item

    this.item = nextItem => new BatchPutItemRequest(this[$entity], nextItem)
  }

  params = () => {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'PutBatchItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item])
  }

  requestType = 'PutRequest' as const
}
