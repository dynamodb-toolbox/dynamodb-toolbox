import type { MapAttributeBasicValue, Extension } from 'v1/schema'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import type { MapAttributeParsedBasicValue } from '../types'
import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseMapAttributeParsedInput = <EXTENSION extends Extension>(
  mapInput: MapAttributeParsedBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): MapAttributeBasicValue<EXTENSION> => {
  const collapsedInput: MapAttributeBasicValue<EXTENSION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const collapsedAttributeInput = collapseAttributeParsedInput(attributeInput, collapsingOptions)
    collapsedInput[mapInput[$savedAs]?.[attributeName] ?? attributeName] = collapsedAttributeInput
  })

  return collapsedInput
}
