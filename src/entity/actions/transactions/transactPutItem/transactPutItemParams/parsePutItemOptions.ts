import { isEmpty } from 'lodash'

import type { EntityV2 } from '~/entity/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import { rejectExtraOptions } from '~/options/rejectExtraOptions.js'

import { PutItemTransactionOptions } from '../options.js'
import type { TransactPutItemParams } from './transactPutItemParams.js'

type TransactionOptions = Omit<TransactPutItemParams, 'TableName' | 'Item'>

export const parsePutItemTransactionOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  putItemTransactionOptions: PutItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const commandOptions: TransactionOptions = {}

  const { condition, ...extraOptions } = putItemTransactionOptions
  rejectExtraOptions(extraOptions)

  if (condition !== undefined) {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = entity.build(EntityConditionParser).parse(condition).toCommandOptions()

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
