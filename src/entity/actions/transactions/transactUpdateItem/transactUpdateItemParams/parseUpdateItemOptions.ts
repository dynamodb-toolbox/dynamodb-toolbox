import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { UpdateItemTransactionOptions } from '../options.js'
import type { TransactUpdateItemParams } from './transactUpdateItemParams.js'

type TransactionOptions = Omit<TransactUpdateItemParams, 'TableName' | 'Key' | 'UpdateExpression'>

type UpdateItemTransactionOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  updateItemTransactionOptions: UpdateItemTransactionOptions<ENTITY>
) => TransactionOptions

export const parseUpdateItemTransactionOptions: UpdateItemTransactionOptionsParser = (
  entity,
  updateItemTransactionOptions
) => {
  const transactionOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = updateItemTransactionOptions
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
