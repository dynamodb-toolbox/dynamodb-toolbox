import type { MapAttribute, MapAttributeBasicValue, Extension } from 'v1/schema'

import type { CollapsingOptions } from './types'
import { collapseAttributeParsedInput } from './attribute'

export const collapseMapAttributeParsedInput = <EXTENSION extends Extension>(
  mapAttribute: MapAttribute,
  mapInput: MapAttributeBasicValue<EXTENSION>,
  collapsingOptions = {} as CollapsingOptions<EXTENSION>
): MapAttributeBasicValue<EXTENSION> => {
  const collapsedInput: MapAttributeBasicValue<EXTENSION> = {}

  Object.entries(mapInput).forEach(([attributeName, attributeInput]) => {
    if (attributeInput === undefined) {
      return
    }

    const attribute = mapAttribute.attributes[attributeName]

    const collapsedAttributeValue = collapseAttributeParsedInput(
      attribute,
      attributeInput,
      collapsingOptions
    )

    collapsedInput[attribute.savedAs ?? attributeName] = collapsedAttributeValue
  })

  return collapsedInput
}
