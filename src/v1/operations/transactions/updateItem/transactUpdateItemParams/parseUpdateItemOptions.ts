import type { EntityV2 } from 'v1/entity'
import { parseCondition } from 'v1/operations/expression/condition/parse'

import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'

import { UpdateItemTransactionOptions } from '../options'
import type { TransactUpdateItemParams } from './transactUpdateItemParams'

type TransactionOptions = Omit<TransactUpdateItemParams, 'TableName' | 'Key' | 'UpdateExpression'>

export const parseUpdateItemTransactionOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemTransactionOptions: UpdateItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const transactionOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = putItemTransactionOptions
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = parseCondition(entity, condition)

    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
    transactionOptions.ConditionExpression = ConditionExpression
  }

  return transactionOptions
}
