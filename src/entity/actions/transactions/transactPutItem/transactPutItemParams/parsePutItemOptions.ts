import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import type { PutItemTransactionOptions } from '../options.js'
import type { TransactPutItemParams } from './transactPutItemParams.js'

type TransactionOptions = Omit<TransactPutItemParams, 'TableName' | 'Item'>

export const parsePutItemTransactionOptions = <ENTITY extends Entity>(
  entity: ENTITY,
  putItemTransactionOptions: PutItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const commandOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = putItemTransactionOptions
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
      .build(EntityConditionParser)
      .parse(condition)
      .toCommandOptions()

    if (!isEmpty(ExpressionAttributeNames)) {
      commandOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    if (!isEmpty(ExpressionAttributeValues)) {
      commandOptions.ExpressionAttributeValues = ExpressionAttributeValues
    }

    commandOptions.ConditionExpression = ConditionExpression
  }

  return commandOptions
}
