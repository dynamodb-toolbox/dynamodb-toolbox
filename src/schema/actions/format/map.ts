import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { MapSchema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'
import { schemaFormatter } from './schema.js'
import { matchProjection, sanitize } from './utils.js'

export function* mapSchemaFormatter(
  schema: MapSchema,
  rawValue: unknown,
  { attributes, valuePath = [], ...restOptions }: FormatAttrValueOptions<MapSchema> = {}
): Generator<
  FormatterYield<MapSchema, FormatAttrValueOptions<MapSchema>>,
  FormatterReturn<MapSchema, FormatAttrValueOptions<MapSchema>>
> {
  const { format = true, transform = true } = restOptions

  if (!isObject(rawValue)) {
    const { type } = schema
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
  for (const [attributeName, attribute] of Object.entries(schema.attributes)) {
    const { props } = attribute
    const { savedAs } = props

    const sanitizedAttributeName = sanitize(attributeName)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^\\.${sanitizedAttributeName}|^\\['${sanitizedAttributeName}']`),
      attributes
    )

    if (!isProjected) {
      continue
    }

    const attributeSavedAs = transform ? (savedAs ?? attributeName) : attributeName
    formatters[attributeName] = schemaFormatter(attribute, rawValue[attributeSavedAs], {
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
          schema.attributes[attrName]?.props.hidden !== true && attrValue !== undefined
      )
  )

  return formattedValue
}
