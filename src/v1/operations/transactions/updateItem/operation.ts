import type { EntityV2 } from 'v1/entity'

import { DynamoDBToolboxError } from 'v1/errors'

import { $entity, EntityOperation } from '../../class'
import type { UpdateItemInput } from '../../updateItem/types'
import type { WriteItemTransaction } from '../types'
import { transactUpdateItemParams, TransactUpdateItemParams } from './transactUpdateItemParams'
import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { UpdateItemTransactionOptions } from './options'

export const $item = Symbol('$item')
export type $item = typeof $item

export const $options = Symbol('$options')
export type $options = typeof $options

export class UpdateItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends UpdateItemTransactionOptions<ENTITY> = UpdateItemTransactionOptions<ENTITY>
  >
  extends EntityOperation<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Update'> {
  static operationName = 'transactUpdate' as const;

  [$item]?: UpdateItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateItemInput<ENTITY>): UpdateItemTransaction<ENTITY> {
    return new UpdateItemTransaction(this[$entity], nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateItemTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): UpdateItemTransaction<ENTITY, NEXT_OPTIONS> {
    return new UpdateItemTransaction(this[$entity], this[$item], nextOptions)
  }

  params(): TransactUpdateItemParams {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('operations.incompleteOperation', {
        message: 'UpdateItemTransaction incomplete: Missing "item" property'
      })
    }

    return transactUpdateItemParams(this[$entity], this[$item], this[$options])
  }

  get(): {
    documentClient: DynamoDBDocumentClient
    type: 'Update'
    params: TransactUpdateItemParams
  } {
    return {
      documentClient: this[$entity].table.documentClient,
      type: 'Update',
      params: this.params()
    }
  }
}

export type UpdateItemTransactionClass = typeof UpdateItemTransaction
