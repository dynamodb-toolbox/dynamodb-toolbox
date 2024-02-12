import type { MapAttribute, AttributeValue, MapAttributeValue } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatOptions } from './schema'
import { formatSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const formatSavedMapAttribute = (
  attribute: MapAttribute,
  savedValue: AttributeValue,
  { attributes, ...restOptions }: FormatOptions = {}
): MapAttributeValue => {
  if (!isObject(savedValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: {
        received: savedValue,
        expected: type
      }
    })
  }

  const formattedMap: MapAttributeValue = {}

  Object.entries(attribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^\\.' + attributeName),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatSavedAttribute(attribute, savedValue[attributeSavedAs], {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = formattedAttribute
    }
  })

  return formattedMap
}
