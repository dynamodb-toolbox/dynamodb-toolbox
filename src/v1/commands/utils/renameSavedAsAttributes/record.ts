import type { PossiblyUndefinedResolvedMapAttribute } from 'v1/schema'
import type { ParsedRecordAttributeInput } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = (
  mapInput: ParsedRecordAttributeInput
): PossiblyUndefinedResolvedMapAttribute => {
  const renamedInput: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
