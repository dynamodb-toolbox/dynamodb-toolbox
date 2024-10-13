import type { MapAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

type MapAttrRawValueFormatter = <
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<MapAttribute, InferValueOptions<ATTRIBUTE, OPTIONS>>

export const formatMapAttrRawValue: MapAttrRawValueFormatter = <
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends FormatValueOptions<ATTRIBUTE> = {}
>(
  attribute: ATTRIBUTE,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
) => {
  if (!isObject(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formattedMap: Record<string, unknown> = {}

  Object.entries(attribute.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const sanitizedAttributeName = sanitize(attributeName)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^\\.${sanitizedAttributeName}|^\\['${sanitizedAttributeName}']`),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatAttrRawValue(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      ...restOptions
    })

    if (formattedAttribute !== undefined) {
      formattedMap[attributeName] = formattedAttribute
    }
  })

  return formattedMap
}
