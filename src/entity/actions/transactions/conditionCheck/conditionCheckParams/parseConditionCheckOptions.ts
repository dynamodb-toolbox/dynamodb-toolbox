import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'

import type { ConditionCheckParams } from './conditionCheckParams.js'

type TransactionOptions = Omit<ConditionCheckParams, 'TableName' | 'Key'>

type ConditionCheckOptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  condition: Condition<ENTITY>
) => TransactionOptions

export const parseConditionCheckOptions: ConditionCheckOptionsParser = (entity, condition) => {
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
