import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { ConditionParser } from './conditionParser'

export const toCommandOptions = (
  conditionParser: ConditionParser
): {
  ConditionExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, NativeAttributeValue>
} => {
  const ExpressionAttributeNames: Record<string, string> = {}

  conditionParser.expressionAttributeNames.forEach((expressionAttributeName, index) => {
    ExpressionAttributeNames[
      `#${conditionParser.expressionAttributePrefix}${index + 1}`
    ] = expressionAttributeName
  })

  const ExpressionAttributeValues: Record<string, NativeAttributeValue> = {}
  conditionParser.expressionAttributeValues.forEach((expressionAttributeValue, index) => {
    ExpressionAttributeValues[
      `:${conditionParser.expressionAttributePrefix}${index + 1}`
    ] = expressionAttributeValue
  })

  const ConditionExpression = conditionParser.expression

  return {
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ConditionExpression
  }
}
