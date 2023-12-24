import type { MapAttributeBasicValue, Extension } from 'v1/schema'
import { $savedAs, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitive } from 'v1/utils/validation/isPrimitive'

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

    const collapsedAttributeValue = collapseAttributeParsedInput(attributeInput, collapsingOptions)

    const attributeTransformer = mapInput[$transform]?.[attributeName]
    collapsedInput[mapInput[$savedAs]?.[attributeName] ?? attributeName] =
      attributeTransformer !== undefined && isPrimitive(collapsedAttributeValue)
        ? attributeTransformer.parse(collapsedAttributeValue)
        : collapsedAttributeValue
  })

  return collapsedInput
}
