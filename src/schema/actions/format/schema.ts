import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Schema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { attrFormatter } from './attribute.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

export function* schemaFormatter<OPTIONS extends FormatValueOptions<Schema> = {}>(
  schema: Schema,
  rawValue: unknown,
  { attributes, ...restOptions }: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<Schema, OPTIONS>, FormatterReturn<Schema, OPTIONS>> {
  const { format = true, transform = true } = restOptions

  if (!isObject(rawValue)) {
    throw new DynamoDBToolboxError('formatter.invalidItem', {
      message: 'Invalid item detected while formatting. Should be an object.',
      payload: { received: rawValue, expected: 'Object' }
    })
  }

  const formatters: Record<string, Generator<any, any>> = {}
  for (const [attributeName, attribute] of Object.entries(schema.attributes)) {
    const { savedAs } = attribute

    const sanitizedAttributeName = sanitize(attributeName)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^${sanitizedAttributeName}|^\\['${sanitizedAttributeName}']`),
      attributes
    )

    if (!isProjected) {
      continue
    }

    const attributeSavedAs = transform ? savedAs ?? attributeName : attributeName
    formatters[attributeName] = attrFormatter(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      valuePath: [attributeSavedAs],
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
      .map(([attrName, formatter]) => [attrName, formatter.next().value])
      .filter(
        ([attrName, attrValue]) =>
          schema.attributes[attrName]?.hidden !== true && attrValue !== undefined
      )
  )
  return formattedValue
}
