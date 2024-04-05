import { DynamoDBToolboxError } from 'v1/errors'
import { EntityV2, EntityAction, $entity } from 'v1/entity'
import type { PutItemInput } from 'v1/entity/actions/commands/putItem'
import { putItemParams } from 'v1/entity/actions/commands/putItem/putItemParams'

import { BatchWriteItemRequest, $requestType } from '../BatchWriteItemRequest'

export const $item = Symbol('$item')

export class BatchPutItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityAction<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'PutRequest'> {
  static actionName = 'putBatch' as const;

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
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'PutBatchItemCommand incomplete: Missing "item" property'
      })
    }

    return putItemParams(this[$entity], this[$item])
  }
}
