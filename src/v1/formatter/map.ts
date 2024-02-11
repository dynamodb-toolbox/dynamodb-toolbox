import type { MapAttribute, AttributeValue, MapAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { formatSavedAttribute } from './attribute'
import { matchProjection, getItemKey } from './utils'

export const formatSavedMapAttribute = (
  mapAttribute: MapAttribute,
  savedValue: AttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions = {}
): MapAttributeValue => {
  if (!isObject(savedValue)) {
    const { partitionKey, sortKey } = restOptions

    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Invalid attribute in saved item: ${mapAttribute.path}. Should be a ${mapAttribute.type}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: mapAttribute.path,
      payload: {
        received: savedValue,
        expected: mapAttribute.type,
        partitionKey,
        sortKey
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

    const formattedAttribute = formatSavedAttribute(attribute, savedValue[attributeSavedAs], {
      projectedAttributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = formattedAttribute
    }
  })

  return formattedMap
}
