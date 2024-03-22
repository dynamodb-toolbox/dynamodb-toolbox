import type { Attribute } from 'v1/schema/attributes'
import { Parser } from 'v1/schema/actions/parse'

import type { ConditionParser } from './parser'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const inputParser = new Parser(attribute).start(expressionAttributeValue, {
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
