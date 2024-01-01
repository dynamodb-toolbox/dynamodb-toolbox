import type { Attribute, AttributeValue } from 'v1/schema'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { collapseAttributeParsedInput } from 'v1/validation/collapseParsedInput'

import type { ConditionParser } from './parser'

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown
): void => {
  const clonedInput = cloneAttributeInputAndAddDefaults(
    attribute,
    expressionAttributeValue as AttributeValue
  )
  const parsedInput = parseAttributeClonedInput(attribute, clonedInput)
  const collapsedInput = collapseAttributeParsedInput(attribute, parsedInput)

  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    collapsedInput
  )

  conditionParser.appendToExpression(
    `:${conditionParser.expressionAttributePrefix}${expressionAttributeValueIndex}`
  )
}
