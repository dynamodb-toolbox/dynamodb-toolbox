import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

export interface DeleteTransactionOptions<ENTITY extends Entity = Entity> {
  condition?: Condition<ENTITY>
}

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  options: DeleteTransactionOptions<ENTITY>
) => Omit<NonNullable<TransactWriteItem['Delete']>, 'TableName' | 'Key'>

export const parseOptions: OptionsParser = (entity, options) => {
  const transactionOptions: ReturnType<OptionsParser> = {}

  const { condition, ...extraOptions } = options

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

  rejectExtraOptions(extraOptions)

  return transactionOptions
}
