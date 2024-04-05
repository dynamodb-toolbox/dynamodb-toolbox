import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { EntityV2, EntityAction, $entity } from 'v1/entity'
import type { KeyInput } from 'v1/entity/actions/tParse'
import { DynamoDBToolboxError } from 'v1/errors'

import type { DeleteItemTransactionOptions } from './options'
import { transactDeleteItemParams, TransactDeleteItemParams } from './transactDeleteItemParams'
import type { WriteItemTransaction } from '../types'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class DeleteItemTransaction<
    ENTITY extends EntityV2 = EntityV2,
    OPTIONS extends DeleteItemTransactionOptions<ENTITY> = DeleteItemTransactionOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Delete'> {
  static operationName = 'transactDelete' as const;

  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInput<ENTITY>): DeleteItemTransaction<ENTITY> {
    return new DeleteItemTransaction(this[$entity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends DeleteItemTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): DeleteItemTransaction<ENTITY, NEXT_OPTIONS> {
    return new DeleteItemTransaction(this[$entity], this[$key], nextOptions)
  }

  params(): TransactDeleteItemParams {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteItemTransaction incomplete: Missing "key" property'
      })
    }

    return transactDeleteItemParams(this[$entity], this[$key], this[$options])
  }

  get(): {
    documentClient: DynamoDBDocumentClient
    type: 'Delete'
    params: TransactDeleteItemParams
  } {
    return {
      documentClient: this[$entity].table.getDocumentClient(),
      type: 'Delete',
      params: this.params()
    }
  }
}

export type DeleteItemTransactionClass = typeof DeleteItemTransaction
