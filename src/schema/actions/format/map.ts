import type { MapAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

export function* mapAttrFormatter<OPTIONS extends FormatValueOptions<MapAttribute> = {}>(
  mapAttribute: MapAttribute,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<MapAttribute, OPTIONS>, FormatterReturn<MapAttribute, OPTIONS>> {
  const { transform = true } = restOptions

  if (!isObject(rawValue)) {
    const { path, type } = mapAttribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formatters: Record<string, Generator<any, any>> = {}
  for (const [attributeName, attribute] of Object.entries(mapAttribute.attributes)) {
    const { savedAs } = attribute

    const sanitizedAttributeName = sanitize(attributeName)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^\\.${sanitizedAttributeName}|^\\['${sanitizedAttributeName}']`),
      attributes
    )

    if (!isProjected) {
      continue
    }

    const attributeSavedAs = transform ? savedAs ?? attributeName : attributeName
    formatters[attributeName] = attrFormatter(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      ...restOptions
    })
  }

  if (transform) {
    const transformedValue = Object.fromEntries(
      Object.entries(formatters)
        .map(([attrName, formatter]) => [attrName, formatter.next().value])
        .filter(([, attrValue]) => attrValue !== undefined)
    )
    yield transformedValue
  }

  const formattedValue = Object.fromEntries(
    Object.entries(formatters)
      .map(([attrName, formatter]) => [attrName, formatter.next().value])
      .filter(
        ([attrName, attrValue]) =>
          mapAttribute.attributes[attrName]?.hidden !== true && attrValue !== undefined
      )
  )

  return formattedValue
}
