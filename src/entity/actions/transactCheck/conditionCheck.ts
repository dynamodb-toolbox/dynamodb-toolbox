import { EntityParser } from '~/entity/actions/parse/index.js'
import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity, KeyInputItem } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Require } from '~/types/require.js'

import { WriteTransaction } from '../transactWrite/transaction.js'
import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import { $condition, $key, $options } from './constants.js'
import { parseOptions } from './options.js'
import type { ConditionCheckOptions } from './options.js'

/** Check a condition on an entity item within a `TransactWriteItems` operation. */
export class ConditionCheck<ENTITY extends Entity = Entity>
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static override actionName = 'conditionCheck' as const

  private [$key]?: KeyInputItem<ENTITY>
  private [$condition]?: Condition<ENTITY>
  private [$options]: ConditionCheckOptions

  /** Bind the check to an entity, a key, a condition and options. */
  constructor(
    entity: ENTITY,
    key?: KeyInputItem<ENTITY>,
    condition?: Condition<ENTITY>,
    options: ConditionCheckOptions = {}
  ) {
    super(entity)
    this[$key] = key
    this[$condition] = condition
    this[$options] = options
  }

  /** Set the key of the item to check. */
  key(nextKey: KeyInputItem<ENTITY>): ConditionCheck<ENTITY> {
    return new ConditionCheck(this.entity, nextKey, this[$condition], this[$options])
  }

  /** Set the condition to check. */
  condition(nextCondition: Condition<ENTITY>): ConditionCheck<ENTITY> {
    return new ConditionCheck(this.entity, this[$key], nextCondition, this[$options])
  }

  /** Set the check options. */
  options(
    nextOptions:
      | ConditionCheckOptions
      | ((prevOptions: ConditionCheckOptions) => ConditionCheckOptions)
  ): ConditionCheck<ENTITY> {
    return new ConditionCheck(
      this.entity,
      this[$key],
      this[$condition],
      typeof nextOptions === 'function' ? nextOptions(this[$options]) : nextOptions
    )
  }

  /** Build the raw AWS SDK `ConditionCheck` entry of the transaction. */
  params(): Require<TransactWriteItem, 'ConditionCheck'> {
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

    const options = this[$options]
    const { key } = this.entity.build(EntityParser).parse(this[$key], { mode: 'key' })
    const awsOptions = parseOptions(this.entity, this[$condition], options)

    return {
      ConditionCheck: {
        TableName: options.tableName ?? this.entity.table.getName(),
        Key: key,
        ...awsOptions
      }
    }
  }
}
