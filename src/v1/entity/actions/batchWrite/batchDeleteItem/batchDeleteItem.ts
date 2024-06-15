import { DynamoDBToolboxError } from 'v1/errors'
import { EntityV2, EntityAction, $entity } from 'v1/entity'
import type { KeyInput } from 'v1/entity/actions/parse'
import { deleteItemParams } from 'v1/entity/actions/commands/deleteItem/deleteItemParams'

import type { BatchWriteItemRequest } from '../BatchWriteItemRequest'
import { $requestType } from '../BatchWriteItemRequest'

export const $key = Symbol('$key')

export class BatchDeleteItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityAction<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'DeleteRequest'> {
  static actionName = 'deleteBatch' as const;

  [$key]?: KeyInput<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key
  }

  [$requestType] = 'DeleteRequest' as const

  key(nextKey: KeyInput<ENTITY>): BatchDeleteItemRequest<ENTITY> {
    return new BatchDeleteItemRequest(this[$entity], nextKey)
  }

  params() {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return deleteItemParams(this[$entity], this[$key])
  }
}
