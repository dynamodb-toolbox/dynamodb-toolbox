import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'
import type { PutCommandInput } from '@aws-sdk/lib-dynamodb'

import type { ConditionParser } from './conditionParser'

export const toCommandOptions = (
  conditionParser: ConditionParser
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => {
  const ExpressionAttributeNames: PutCommandInput['ExpressionAttributeNames'] = {}

  conditionParser.expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[`#${index + 1}`] = expressionAttributeName
  })

  const ExpressionAttributeValues: PutCommandInput['ExpressionAttributeValues'] = {}
  conditionParser.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[`:${index + 1}`] = expressionAttributeValue
  })

  const ConditionExpression = conditionParser.conditionExpression

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
