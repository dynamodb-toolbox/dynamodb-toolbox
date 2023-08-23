import type { Attribute, AttributeValue } from 'v1/schema'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { renameAttributeSavedAsAttributes } from 'v1/validation/renameSavedAsAttributes'

import type { ConditionParser } from './parser'

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown
): void => {
  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    renameAttributeSavedAsAttributes(
      parseAttributeClonedInput(
        attribute,
        cloneAttributeInputAndAddDefaults(attribute, expressionAttributeValue as AttributeValue)
      )
    )
  )

  conditionParser.appendToExpression(`:c${expressionAttributeValueIndex}`)
}
