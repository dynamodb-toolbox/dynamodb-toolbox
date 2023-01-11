import { MapAttribute, PossiblyUndefinedResolvedMapAttribute } from 'v1'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameMapAttributeSavedAsAttributes = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedMapAttribute
) => {
  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    const attributeInput = input[attributeName]

    if (attributeInput !== undefined) {
      input[attributeName] = renameAttributeSavedAsAttributes(attribute, attributeInput)
    }

    if (attribute.savedAs !== undefined && input[attributeName] !== undefined) {
      input[attribute.savedAs] = input[attributeName]
      delete input[attributeName]
    }
  })

  return input
}
