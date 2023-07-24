import type { PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import type { ParsedRecordAttributeInput } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = (
  mapInput: ParsedRecordAttributeInput
): PossiblyUndefinedResolvedAttribute => {
  const renamedInput: PossiblyUndefinedResolvedAttribute = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
