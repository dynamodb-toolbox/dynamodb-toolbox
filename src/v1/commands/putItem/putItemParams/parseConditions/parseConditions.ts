import type { Conditions } from 'v1/commands/conditions/types'
import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import { parseCondition } from './parseCondition'

export const parseConditions = (
  conditions: Conditions
): Pick<
  PutCommandInput,
  'ExpressionAttributeNames' | 'ExpressionAttributeValues' | 'ConditionExpression'
> => {
  const {
    expressionAttributeNames,
    expressionAttributeValues,
    conditionExpression: ConditionExpression
  } = parseCondition(conditions)

  const ExpressionAttributeNames: PutCommandInput['ExpressionAttributeNames'] = {}
  expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[`#${index + 1}`] = expressionAttributeName
  })

  const ExpressionAttributeValues: PutCommandInput['ExpressionAttributeValues'] = {}
  expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[`:${index + 1}`] = expressionAttributeValue
  })

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
