import type {
  MapAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/item'
import { isObject } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedMapAttribute = (
  mapAttribute: MapAttribute,
  savedItem: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(savedItem)) {
    // TODO
    throw new Error()
  }

  const formattedMap: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = parseSavedAttribute(attribute, savedItem[attributeSavedAs])
    }
  })

  return formattedMap
}
