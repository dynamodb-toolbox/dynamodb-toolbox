import cloneDeep from 'lodash.clonedeep'

import { MapAttribute, ResolvedAttribute, ResolvedMapAttribute } from 'v1/item'
import { isObject } from 'v1/utils/validation'

export const parseSavedMapAttribute = (
  mapAttribute: MapAttribute,
  savedItem: ResolvedAttribute
): ResolvedAttribute => {
  if (!isObject(savedItem)) {
    return cloneDeep(savedItem)
  }

  const formattedMapAttribute: ResolvedMapAttribute = {}

  const additionalAttributes = new Set(Object.keys(savedItem))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    const attributeSavedAs = attribute.savedAs ?? attributeName

    additionalAttributes.delete(attributeSavedAs)

    if (attribute.hidden) {
      return
    }

    if (savedItem[attributeSavedAs] !== undefined) {
      formattedMapAttribute[attributeName] = savedItem[attributeSavedAs]
    }
  })

  additionalAttributes.forEach(attributeName => {
    formattedMapAttribute[attributeName] = cloneDeep(savedItem[attributeName])
  })

  return formattedMapAttribute
}
