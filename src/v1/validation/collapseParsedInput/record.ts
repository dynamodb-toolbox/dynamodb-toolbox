import type { RecordAttribute, RecordAttributeBasicValue, Extension } from 'v1/schema'

import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseRecordAttributeParsedInput = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  recordInput: RecordAttributeBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): RecordAttributeBasicValue<EXTENSION> => {
  const collapsedInput: RecordAttributeBasicValue<EXTENSION> = {}

  const keysAttributes = recordAttribute.keys
  const elementsAttributes = recordAttribute.elements

  Object.entries(recordInput).forEach(([elementKey, elementValue]) => {
    if (elementValue === undefined) {
      return
    }

    collapsedInput[
      collapseAttributeParsedInput(keysAttributes, elementKey, collapsingOptions) as string
    ] = collapseAttributeParsedInput(elementsAttributes, elementValue, collapsingOptions)
  })

  return collapsedInput
}
