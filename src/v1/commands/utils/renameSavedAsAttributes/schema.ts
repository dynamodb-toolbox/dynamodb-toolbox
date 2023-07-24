import type { ResolvedItem, AdditionalResolution } from 'v1/schema'
import type { ParsedSchemaInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  schemaInput: ParsedSchemaInput<ADDITIONAL_RESOLUTION>
): ResolvedItem<ADDITIONAL_RESOLUTION> => {
  const renamedInput: ResolvedItem<ADDITIONAL_RESOLUTION> = {}

  Object.entries(schemaInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[schemaInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
