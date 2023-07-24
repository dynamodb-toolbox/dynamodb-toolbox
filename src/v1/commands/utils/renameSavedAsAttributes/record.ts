import type { RecordAttributeValue, Extension } from 'v1/schema'
import type { ParsedRecordAttributeInput } from 'v1/validation/parseClonedInput'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  recordInput: ParsedRecordAttributeInput<EXTENSION>
): RecordAttributeValue<EXTENSION> => {
  const renamedInput: RecordAttributeValue<EXTENSION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    /**
     * @debt extensions "To fix by using ParsedRecordAttributeBaseValue"
     */
    // @ts-expect-error
    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput)
  })

  return renamedInput
}
