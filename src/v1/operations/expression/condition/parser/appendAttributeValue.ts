import type { Attribute, AttributeValue } from 'v1/schema'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'

import type { ConditionParser } from './parser'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const inputParser = parseAttributeClonedInput(
    attribute,
    expressionAttributeValue as AttributeValue,
    { transform }
  )
  inputParser.next() // cloned
  inputParser.next() // parsed
  const collapsedInput = inputParser.next().value

  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    collapsedInput
  )

  conditionParser.appendToExpression(
    `:${conditionParser.expressionAttributePrefix}${expressionAttributeValueIndex}`
  )
}
