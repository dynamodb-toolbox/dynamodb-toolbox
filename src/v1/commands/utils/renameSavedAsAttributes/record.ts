import type { ResolvedRecordAttribute, AdditionalResolution } from 'v1/schema'
import type { ParsedRecordAttributeInput } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = <
  ADDITIONAL_RESOLUTION extends AdditionalResolution
>(
  recordInput: ParsedRecordAttributeInput<ADDITIONAL_RESOLUTION>
): ResolvedRecordAttribute<ADDITIONAL_RESOLUTION> => {
  const renamedInput: ResolvedRecordAttribute<ADDITIONAL_RESOLUTION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
