import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'

import { PutItemTransactionOptions } from '../options'
import type { TransactPutItemParams } from './transactPutItemParams'

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
