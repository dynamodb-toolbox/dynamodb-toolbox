import type { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'
import { renameAttributeSavedAsAttributes } from 'v1/commands/utils/renameSavedAsAttributes/index'

import type { ConditionParser } from './conditionParser'

export const appendAttributeValue = (
  conditionParser: ConditionParser,
  attribute: Attribute,
  expressionAttributeValue: unknown
): void => {
  const expressionAttributeValueIndex = conditionParser.expressionAttributeValues.push(
    renameAttributeSavedAsAttributes(
      attribute,
      parseAttributeClonedInput(
        attribute,
        cloneAttributeInputAndAddDefaults(
          attribute,
          expressionAttributeValue as PossiblyUndefinedResolvedAttribute
        )
      )
    )
  )

  conditionParser.appendToExpression(`:${expressionAttributeValueIndex}`)
}
