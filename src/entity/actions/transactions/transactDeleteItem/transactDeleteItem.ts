import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity, EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import type { WriteItemTransaction } from '../types.js'
import type { DeleteItemTransactionOptions } from './options.js'
import { transactDeleteItemParams } from './transactDeleteItemParams/index.js'
import type { TransactDeleteItemParams } from './transactDeleteItemParams/index.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class DeleteItemTransaction<
    ENTITY extends Entity = Entity,
    OPTIONS extends DeleteItemTransactionOptions<ENTITY> = DeleteItemTransactionOptions<ENTITY>
  >
  extends EntityAction<ENTITY>
  implements WriteItemTransaction<ENTITY, 'Delete'>
{
  static actionName = 'transactDelete' as const;

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
