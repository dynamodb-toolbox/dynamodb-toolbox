import type { Extension } from 'v1/schema'

import type { RecordAttributeParsedBasicValue } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseRecordAttributeParsedInput = <EXTENSION extends Extension>(
  recordInput: RecordAttributeParsedBasicValue<EXTENSION>,
  renamingOptions = {} as CollapsingOptions<EXTENSION>
): RecordAttributeParsedBasicValue<EXTENSION> => {
  const collapsedInput: RecordAttributeParsedBasicValue<EXTENSION> = {}

  Object.entries(recordInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    collapsedInput[attributeName] = collapseAttributeParsedInput(attributeInput, renamingOptions)
  })

  return collapsedInput
}
