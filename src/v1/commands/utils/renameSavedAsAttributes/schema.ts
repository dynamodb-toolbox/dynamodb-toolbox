import type { PossiblyUndefinedResolvedItem } from 'v1/schema'
import type { ParsedSchemaInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = (
  schemaInput: ParsedSchemaInput
): PossiblyUndefinedResolvedItem => {
  const renamedInput: PossiblyUndefinedResolvedItem = {}

  Object.entries(schemaInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[schemaInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
