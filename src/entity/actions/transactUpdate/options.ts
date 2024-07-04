import type { Condition } from '~/entity/actions/parseCondition.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

export interface UpdateTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
}

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  options: UpdateTransactionOptions<ENTITY>
) => Omit<NonNullable<TransactWriteItem['Update']>, 'TableName' | 'Key' | 'UpdateExpression'>

export const parseOptions: OptionsParser = (entity, options) => {
  const transactionOptions: ReturnType<OptionsParser> = {}

  const { condition, ...extraOptions } = options
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)
      .toCommandOptions()

    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
    transactionOptions.ConditionExpression = ConditionExpression
  }

  return transactionOptions
}
