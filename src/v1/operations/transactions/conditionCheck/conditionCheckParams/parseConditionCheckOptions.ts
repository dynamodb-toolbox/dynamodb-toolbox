import type { ConditionCheckParams } from './conditionCheckParams'
import isEmpty from 'lodash.isempty'
import type { EntityV2 } from 'v1/entity'
import { parseCondition } from 'v1/operations/expression/condition/parse'
import { Condition } from 'v1/operations/types'

type TransactionOptions = Omit<ConditionCheckParams, 'TableName' | 'Key'>

export const parseConditionCheck = <ENTITY extends EntityV2>(
  entity: ENTITY,
  condition: Condition<ENTITY>
): TransactionOptions => {
  const {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  } = parseCondition(entity, condition)

  const transactionOptions: TransactionOptions = { ConditionExpression }

  if (!isEmpty(ExpressionAttributeNames)) {
    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
  }

  if (!isEmpty(ExpressionAttributeValues)) {
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
  }

  return transactionOptions
}
