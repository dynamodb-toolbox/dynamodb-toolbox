import type { PossiblyUndefinedResolvedMapAttribute } from 'v1/schema'
import type { ParsedMapAttributeInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = (
  mapInput: ParsedMapAttributeInput
): PossiblyUndefinedResolvedMapAttribute => {
  const renamedInput: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[mapInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
