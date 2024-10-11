import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue, Schema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { formatAttrRawValue } from './attribute.js'
import type { FormatValueOptions, InferValueOptions } from './options.js'
import { matchProjection, sanitize } from './utils.js'

type SchemaRawValueFormatter = <
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA> = {}
>(
  schema: SCHEMA,
  rawValue: unknown,
  options?: OPTIONS
) => FormattedValue<Schema, InferValueOptions<SCHEMA, OPTIONS>>

export const formatSchemaRawValue: SchemaRawValueFormatter = <
  SCHEMA extends Schema,
  OPTIONS extends FormatValueOptions<SCHEMA> = {}
>(
  schema: SCHEMA,
  rawValue: unknown,
  { attributes, partial = false }: OPTIONS = {} as OPTIONS
) => {
  if (!isObject(rawValue)) {
    throw new DynamoDBToolboxError('formatter.invalidItem', {
      message: 'Invalid item detected while formatting. Should be an object.',
      payload: { received: rawValue, expected: 'Object' }
    })
  }

  const formattedValue: Record<string, unknown> = {}

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const sanitizedAttributeName = sanitize(attributeName)
    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp(`^${sanitizedAttributeName}|^\\['${sanitizedAttributeName}']`),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatAttrRawValue(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      partial
    })

    if (formattedAttribute !== undefined) {
      formattedValue[attributeName] = formattedAttribute
    }
  })

  return formattedValue
}
