import type { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { cloneAttributeInputAndAddDefaults } from 'v1/validation/cloneInputAndAddDefaults'

import type { ConditionParser } from './conditionParser'
import { renameAttributeSavedAsAttributes } from '../../renameSavedAsAttributes/index'

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

  conditionParser.appendToConditionExpression(`:${expressionAttributeValueIndex}`)
}
