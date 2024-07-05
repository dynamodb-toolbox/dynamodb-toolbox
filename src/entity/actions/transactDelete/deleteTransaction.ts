import type { O } from 'ts-toolbelt'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { WriteTransaction } from '../transactWrite/transaction.js'
import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import type { DeleteTransactionOptions } from './options.js'
import { parseOptions } from './options.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class DeleteTransaction<
    ENTITY extends Entity = Entity,
    OPTIONS extends DeleteTransactionOptions<ENTITY> = DeleteTransactionOptions<ENTITY>
  >
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static actionName = 'transactDelete' as const;

  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInput<ENTITY>): DeleteTransaction<ENTITY> {
    return new DeleteTransaction(this[$entity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends DeleteTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): DeleteTransaction<ENTITY, NEXT_OPTIONS> {
    return new DeleteTransaction(this[$entity], this[$key], nextOptions)
  }

  params(): O.Required<TransactWriteItem, 'Delete'> {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeleteTransaction incomplete: Missing "key" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })
    const options = parseOptions(this[$entity], this[$options])

    return {
      Delete: {
        TableName: this[$entity].table.getName(),
        Key: key,
        ...options
      }
    }
  }
}

export type DeleteTransactionClass = typeof DeleteTransaction