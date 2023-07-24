import type { Extension } from 'v1/schema'
import type { RecordAttributeParsedBasicValue } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  recordInput: RecordAttributeParsedBasicValue<EXTENSION>
): RecordAttributeParsedBasicValue<EXTENSION> => {
  const renamedInput: RecordAttributeParsedBasicValue<EXTENSION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
