import type { MapAttribute, AttributeValue, MapAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const parseSavedMapAttribute = (
  mapAttribute: MapAttribute,
  savedMap: AttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions
): MapAttributeValue => {
  if (!isObject(savedMap)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${mapAttribute.path}. Should be a ${mapAttribute.type}`,
      path: mapAttribute.path,
      payload: {
        received: savedMap,
        expected: mapAttribute.type
      }
    })
  }

  const formattedMap: MapAttributeValue = {}

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^\\.' + attributeName),
      projectedAttributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = parseSavedAttribute(attribute, savedMap[attributeSavedAs], {
      projectedAttributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = formattedAttribute
    }
  })

  return formattedMap
}
