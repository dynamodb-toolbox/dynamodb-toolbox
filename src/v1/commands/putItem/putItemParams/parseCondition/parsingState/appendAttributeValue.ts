import type { Attribute } from 'v1/item'

import type { ConditionParsingState } from './conditionParsingState'

export const appendAttributeValue = (
  parsingState: ConditionParsingState,
  attribute: Attribute,
  expressionAttributeValue: unknown
): void => {
  const expressionAttributeValueIndex = parsingState.expressionAttributeValues.push(
    expressionAttributeValue
  )

  parsingState.conditionExpression += `:${expressionAttributeValueIndex}`
}
