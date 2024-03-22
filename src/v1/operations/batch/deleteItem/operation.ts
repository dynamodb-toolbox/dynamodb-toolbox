import type { EntityV2 } from 'v1/entity/class'
import type { KeyInput } from 'v1/operations/types/KeyInput'
import { deleteItemParams } from 'v1/operations/deleteItem/deleteItemParams'
import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { BatchWriteItemRequest } from '../BatchWriteItemRequest'
import { $requestType } from '../BatchWriteItemRequest'

export const $key = Symbol('$key')

export class BatchDeleteItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityOperation<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'DeleteRequest'> {
  static operationName = 'deleteBatch' as const;

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
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return deleteItemParams(this[$entity], this[$key])
  }
}
