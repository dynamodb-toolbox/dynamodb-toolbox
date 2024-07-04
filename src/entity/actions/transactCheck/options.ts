import { isEmpty } from 'lodash'

import { EntityConditionParser } from '~/entity/actions/parseCondition.js'
import type { Condition } from '~/entity/actions/parseCondition.js'
import type { Entity } from '~/entity/index.js'

import type { TransactWriteItem } from '../transactWrite/transaction.js'

type OptionsParser = <ENTITY extends Entity>(
  entity: ENTITY,
  condition: Condition<ENTITY>
) => Omit<NonNullable<TransactWriteItem['ConditionCheck']>, 'TableName' | 'Key'>

export const parseOptions: OptionsParser = (entity, condition) => {
  const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = entity
    .build(EntityConditionParser)
    .parse(condition)
    .toCommandOptions()

  const transactionOptions: ReturnType<OptionsParser> = { ConditionExpression }

  if (!isEmpty(ExpressionAttributeNames)) {
    transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
  }

  if (!isEmpty(ExpressionAttributeValues)) {
    transactionOptions.ExpressionAttributeValues = ExpressionAttributeValues
  }

  return transactionOptions
}
