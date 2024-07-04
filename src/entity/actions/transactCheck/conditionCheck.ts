import type { O } from 'ts-toolbelt'

import { EntityParser } from '~/entity/actions/parse.js'
import type { KeyInput } from '~/entity/actions/parse.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import { $entity } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import { WriteTransaction } from '../transactWrite/transaction.js'
import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import { parseOptions } from './options.js'

export const $key = Symbol('$key')
export type $key = typeof $key

export const $condition = Symbol('$condition')
export type $condition = typeof $condition

export class ConditionCheck<ENTITY extends Entity = Entity>
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static actionName = 'conditionCheck' as const

  private [$key]?: KeyInput<ENTITY>
  private [$condition]?: Condition<ENTITY>

  constructor(entity: ENTITY, key?: KeyInput<ENTITY>, condition?: Condition<ENTITY>) {
    super(entity)
    this[$key] = key
    this[$condition] = condition
  }

  key(nextKey: KeyInput<ENTITY>): ConditionCheck<ENTITY> {
    return new ConditionCheck(this[$entity], nextKey, this[$condition])
  }

  condition(nextCondition: Condition<ENTITY>): ConditionCheck<ENTITY> {
    return new ConditionCheck(this[$entity], this[$key], nextCondition)
  }

  params(): O.Required<TransactWriteItem, 'ConditionCheck'> {
    if (!this[$key]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'ConditionCheck incomplete: Missing "key" property'
      })
    }

    if (!this[$condition]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'ConditionCheck incomplete: Missing "condition" property'
      })
    }

    const { key } = this[$entity].build(EntityParser).parse(this[$key], { mode: 'key' })
    const options = parseOptions(this[$entity], this[$condition])

    return {
      ConditionCheck: {
        TableName: this[$entity].table.getName(),
        Key: key,
        ...options
      }
    }
  }
}

export type ConditionCheckClass = typeof ConditionCheck
