import type {
  MapAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1/item'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedMapAttribute = (
  mapAttribute: MapAttribute,
  value: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(value)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${mapAttribute.path}. Should be a ${mapAttribute.type}`,
      path: mapAttribute.path,
      payload: {
        received: value,
        expected: mapAttribute.type
      }
    })
  }

  const formattedMap: PossiblyUndefinedResolvedMapAttribute = {}

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = parseSavedAttribute(attribute, value[attributeSavedAs])
    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = parseSavedAttribute(attribute, value[attributeSavedAs])
    }
  })

  return formattedMap
}
