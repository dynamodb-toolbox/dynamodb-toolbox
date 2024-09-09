import type { Condition } from '~/entity/actions/parseCondition/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'
import { parseTableNameOption } from '~/options/tableName.js'
import { isEmpty } from '~/utils/isEmpty.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

export interface PutTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
  tableName?: string
}

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  options: PutTransactionOptions<ENTITY>
) => Omit<NonNullable<TransactWriteItem['Put']>, 'TableName' | 'Item'>

export const parseOptions: OptionsParser = (entity, options) => {
  const transactionOptions: ReturnType<OptionsParser> = {}

  const { condition, tableName, ...extraOptions } = options
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)
      .toCommandOptions()

    if (!isEmpty(ExpressionAttributeNames)) {
      transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    if (!isEmpty(ExpressionAttributeValues)) {
      transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
    }

    transactionOptions.ConditionExpression = ConditionExpression
  }

  if (tableName !== undefined) {
    // tableName is a meta-option, validated but not used here
    parseTableNameOption(tableName)
  }

  return transactionOptions
}
