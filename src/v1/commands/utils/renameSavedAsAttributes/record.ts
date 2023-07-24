import type { ResolvedRecordAttribute, Extension } from 'v1/schema'
import type { ParsedRecordAttributeInput } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  recordInput: ParsedRecordAttributeInput<EXTENSION>
): ResolvedRecordAttribute<EXTENSION> => {
  const renamedInput: ResolvedRecordAttribute<EXTENSION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
