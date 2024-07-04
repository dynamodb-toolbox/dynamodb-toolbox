import { isEmpty } from 'lodash'

import type { Condition } from '~/entity/actions/parseCondition.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

export interface PutTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
}

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  options: PutTransactionOptions<ENTITY>
) => Omit<NonNullable<TransactWriteItem['Put']>, 'TableName' | 'Item'>

export const parseOptions: OptionsParser = (entity, options) => {
  const transactionOptions: ReturnType<OptionsParser> = {}

  const { condition, ...extraOptions } = options
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

  return transactionOptions
}
