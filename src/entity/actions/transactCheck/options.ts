import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Condition } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

export interface ConditionCheckOptions {
  tableName?: string
}

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  condition: Condition<ENTITY>,
  options?: ConditionCheckOptions
) => Omit<NonNullable<TransactWriteItem['ConditionCheck']>, 'TableName' | 'Key'>

export const parseOptions: OptionsParser = (entity, condition, options = {}) => {
  const { tableName, ...extraOptions } = options
  rejectExtraOptions(extraOptions)

  const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
    .build(EntityConditionParser)
    .parse(condition)
    .toCommandOptions()

  const transactionOptions: ReturnType<OptionsParser> = { ConditionExpression }

  if (!isEmpty(ExpressionAttributeNames)) {
    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
  }

  if (!isEmpty(ExpressionAttributeValues)) {
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
  }

  if (tableName !== undefined) {
    // tableName is a meta-option, validated but not used here
    parseTableNameOption(tableName)
  }

  return transactionOptions
}
