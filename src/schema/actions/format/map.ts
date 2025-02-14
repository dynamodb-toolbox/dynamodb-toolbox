import type { MapAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

export function* mapAttrFormatter(
  mapAttribute: MapAttribute,
  rawValue: unknown,
  { attributes, valuePath = [], ...restOptions }: FormatAttrValueOptions<MapAttribute> = {}
): Generator<
  FormatterYield<MapAttribute, FormatAttrValueOptions<MapAttribute>>,
  FormatterReturn<MapAttribute, FormatAttrValueOptions<MapAttribute>>
> {
  const { format = true, transform = true } = restOptions

  if (!isObject(rawValue)) {
    const { type } = mapAttribute
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  const formatters: Record<string, Generator<unknown, unknown>> = {}
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
      valuePath: [...valuePath, attributeSavedAs],
      ...restOptions
    })
  }

  if (transform) {
    const transformedValue = Object.fromEntries(
      Object.entries(formatters)
        .map(([attrName, formatter]) => [attrName, formatter.next().value])
        .filter(([, attrValue]) => attrValue !== undefined)
    )
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = Object.fromEntries(
    Object.entries(formatters)
      .map(([attrName, formatter]) => [attrName, formatter.next().value] as [string, unknown])
      .filter(
        ([attrName, attrValue]) =>
          mapAttribute.attributes[attrName]?.hidden !== true && attrValue !== undefined
      )
  )

  return formattedValue
}
