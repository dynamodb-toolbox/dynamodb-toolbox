import type { Attribute, AttributeValue } from 'v1/schema'
import { attributeParser } from 'v1/parsing'

import type { ConditionParser } from './parser'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const inputParser = attributeParser(attribute, expressionAttributeValue as AttributeValue, {
    fill: false,
    transform
  })
  const parsedState = inputParser.next() // parsed
  const transformedInput = parsedState.done ? parsedState.value : inputParser.next().value

  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    transformedInput
  )

  conditionParser.appendToExpression(
    `:${conditionParser.expressionAttributePrefix}${expressionAttributeValueIndex}`
  )
}
