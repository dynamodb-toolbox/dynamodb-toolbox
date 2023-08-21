import type { Extension } from 'v1/schema'

import type { RecordAttributeParsedBasicValue } from '../types'
import type { RenamingOptions } from './types'
import { renameAttributeSavedAsAttributes } from './attribute'

export const renameRecordAttributeSavedAsAttributes = <EXTENSION extends Extension>(
  recordInput: RecordAttributeParsedBasicValue<EXTENSION>,
  renamingOptions = {} as RenamingOptions<EXTENSION>
): RecordAttributeParsedBasicValue<EXTENSION> => {
  const renamedInput: RecordAttributeParsedBasicValue<EXTENSION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    renamedInput[attributeName] = renameAttributeSavedAsAttributes(attributeInput, renamingOptions)
  })

  return renamedInput
}
