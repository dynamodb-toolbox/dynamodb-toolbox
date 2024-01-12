import type { EntityV2 } from 'v1/entity'
import { DynamoDBToolboxError } from 'v1/errors'
import { deleteItemParams } from 'v1/operations/deleteItem/deleteItemParams'
import type { KeyInput } from 'v1/operations/types/KeyInput'

import { $entity, EntityOperation } from '../../class'
import type { BatchWriteItemRequest } from '../BatchWriteItemRequest'
import { $requestType } from '../BatchWriteItemRequest'

export const $key = Symbol('$key')

export class BatchDeleteItemRequest<ENTITY extends EntityV2 = EntityV2>
  extends EntityOperation<ENTITY>
  implements BatchWriteItemRequest<ENTITY, 'DeleteRequest'> {
  static operationName = 'deleteBatch' as const;

  [$key]?: KeyInput<ENTITY>
  key: (keyInput: KeyInput<ENTITY>) => BatchDeleteItemRequest<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>) {
    super(entity)
    this[$key] = key

    this.key = nextKey => new BatchDeleteItemRequest(this[$entity], nextKey)
  }

  params = () => {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('operations.incompleteCommand', {
        message: 'DeleteItemCommand incomplete: Missing "key" property'
      })
    }

    return deleteItemParams(this[$entity], this[$key])
  };

  [$requestType] = 'DeleteRequest' as const
}
