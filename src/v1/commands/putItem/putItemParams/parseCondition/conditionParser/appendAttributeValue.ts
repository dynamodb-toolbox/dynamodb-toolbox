import type { Attribute } from 'v1/item'

import type { ConditionParser } from './conditionParser'

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  // TODO: Validate that value is correct regarding attribute
  attribute: Attribute,
  expressionAttributeValue: unknown
): void => {
  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    expressionAttributeValue
  )

  conditionParser.appendToConditionExpression(`:${expressionAttributeValueIndex}`)
}
