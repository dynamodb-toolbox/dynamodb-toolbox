import { MapAttribute, ResolvedAttribute, ResolvedMapAttribute } from 'v1/item'
import { isObject } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedMapAttribute = (
  mapAttribute: MapAttribute,
  savedItem: ResolvedAttribute
): ResolvedAttribute => {
  if (!isObject(savedItem)) {
    // TODO
    throw new Error()
  }

  const formattedMap: ResolvedMapAttribute = {}

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    const attributeSavedAs = attribute.savedAs ?? attributeName

    if (attribute.hidden) {
      return
    }

    if (savedItem[attributeSavedAs] !== undefined) {
      const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs])

      if (formattedAttribute !== undefined) {
        formattedMap[attributeName] = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
      }
    }
  })

  return formattedMap
}
