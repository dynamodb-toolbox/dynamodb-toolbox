import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { DeleteItemTransactionOptions } from '../options.js'
import type { TransactDeleteItemParams } from './transactDeleteItemParams.js'

type TransactionOptions = Omit<TransactDeleteItemParams, 'TableName' | 'Key'>

type DeleteItemTransactionOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  deleteItemTransactionOptions: DeleteItemTransactionOptions<ENTITY>
) => TransactionOptions

export const parseDeleteItemTransactionOptions: DeleteItemTransactionOptionsParser = (
  entity,
  deleteItemTransactionOptions
) => {
  const transactionOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = deleteItemTransactionOptions

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
