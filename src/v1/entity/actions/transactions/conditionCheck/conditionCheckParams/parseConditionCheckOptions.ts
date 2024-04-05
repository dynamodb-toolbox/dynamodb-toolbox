import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { EntityConditionParser } from 'v1/entity/actions/parseCondition'
import type { Condition } from 'v1/operations/types'

import type { ConditionCheckParams } from './conditionCheckParams'

type TransactionOptions = Omit<ConditionCheckParams, 'TableName' | 'Key'>

export const parseConditionCheck = <ENTITY extends EntityV2>(
  entity: ENTITY,
  condition: Condition<ENTITY>
): TransactionOptions => {
  const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
    .build(EntityConditionParser)
    .parse(condition)
    .toCommandOptions()

  const transactionOptions: TransactionOptions = { ConditionExpression }

  if (!isEmpty(ExpressionAttributeNames)) {
    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
  }

  if (!isEmpty(ExpressionAttributeValues)) {
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
  }

  return transactionOptions
}
