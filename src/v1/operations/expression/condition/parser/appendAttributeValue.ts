import type { Attribute, AttributeValue } from 'v1/schema'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import type { ConditionParser } from './parser'

export type AppendAttributeValueOptions = { transform?: boolean }

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown,
  options: AppendAttributeValueOptions = {}
): void => {
  const { transform = false } = options

  const clonedInput = cloneAttributeInputAndAddDefaults(
    attribute,
    expressionAttributeValue as AttributeValue
  )
  const inputParser = parseAttributeClonedInput(attribute, clonedInput, { transform })
  inputParser.next()
  const collapsedInput = inputParser.next().value

  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    collapsedInput
  )

  conditionParser.appendToExpression(
    `:${conditionParser.expressionAttributePrefix}${expressionAttributeValueIndex}`
  )
}
