import type { ResolvedMapAttribute, AdditionalResolution } from 'v1/schema'
import type { ParsedMapAttributeInput } from 'v1/validation/parseClonedInput'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = <
  ADDITIONAL_RESOLUTION extends AdditionalResolution
>(
  mapInput: ParsedMapAttributeInput<ADDITIONAL_RESOLUTION>
): ResolvedMapAttribute<ADDITIONAL_RESOLUTION> => {
  const renamedInput: ResolvedMapAttribute<ADDITIONAL_RESOLUTION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const renamedAttributeInput = renameAttributeSavedAsAttributes(attributeInput)
    renamedInput[mapInput[$savedAs][attributeName] ?? attributeName] = renamedAttributeInput
  })

  return renamedInput
}
