import type { O } from 'ts-toolbelt'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import { $entity, EntityAction } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import type { TransactGetItem } from '../transaction.js'
import type { GetTransactionOptions } from './options.js'
import { parseOptions } from './options.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $options = Symbol('$options')
export type $options = typeof $options

export class GetTransaction<
  ENTITY extends Entity = Entity,
  OPTIONS extends GetTransactionOptions<ENTITY> = GetTransactionOptions<ENTITY>
> extends EntityAction<ENTITY> {
  static actionName = 'transactGet' as const;

  [$key]?: KeyInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$key] = key
    this[$options] = options
  }

  key(nextKey: KeyInput<ENTITY>): GetTransaction<ENTITY> {
    return new GetTransaction(this[$entity], nextKey, this[$options])
  }

  options<NEXT_OPTIONS extends GetTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS
  ): GetTransaction<ENTITY, NEXT_OPTIONS> {
    return new GetTransaction(this[$entity], this[$key], nextOptions)
  }

  params(): O.NonNullable<TransactGetItem, 'Get'> {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'GetTransaction incomplete: Missing "key" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })
    const options = parseOptions(this[$entity], this[$options])

    return {
      Get: {
        TableName: this[$entity].table.getName(),
        Key: key,
        ...options
      }
    }
  }
}

export type GetTransactionClass = typeof GetTransaction
