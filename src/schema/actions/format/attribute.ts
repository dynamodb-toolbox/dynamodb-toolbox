import type { Schema, SchemaRequiredProp } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'

import { anySchemaFormatter } from './any.js'
import { anyOfSchemaFormatter } from './anyOf.js'
import type { FormatterReturn, FormatterYield } from './formatter.js'
import { listSchemaFormatter } from './list.js'
import { mapSchemaFormatter } from './map.js'
import type { FormatAttrValueOptions } from './options.js'
import { primitiveSchemaFormatter } from './primitive.js'
import { recordSchemaFormatter } from './record.js'
import { setSchemaFormatter } from './set.js'

export const requiringOptions = new Set<SchemaRequiredProp>(['always', 'atLeastOnce'])

export const isRequired = ({ props }: Schema): boolean =>
  requiringOptions.has(props.required ?? 'atLeastOnce')

export function* attrFormatter<
  SCHEMA extends Schema,
  OPTIONS extends FormatAttrValueOptions<SCHEMA> = {}
>(
  schema: SCHEMA,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<
  FormatterYield<Schema, FormatAttrValueOptions<Schema>>,
  FormatterReturn<Schema, FormatAttrValueOptions<Schema>>
> {
  const { format = true, transform = true, valuePath } = options

  if (rawValue === undefined) {
    if (isRequired(schema) && options.partial !== true) {
      const path = formatValuePath(valuePath)

      throw new DynamoDBToolboxError('formatter.missingAttribute', {
        message: `Missing required attribute for formatting${
          path !== undefined ? `: '${path}'` : ''
        }.`,
        path,
        payload: {}
      })
    }

    if (transform) {
      if (format) {
        yield undefined
      } else {
        return undefined
      }
    }

    return undefined
  }

  switch (schema.type) {
    case 'any':
      return yield* anySchemaFormatter(schema, rawValue, options)
    case 'null':
    case 'boolean':
    case 'number':
    case 'string':
    case 'binary':
      return yield* primitiveSchemaFormatter(schema, rawValue, {
        ...options,
        attributes: undefined
      })
    case 'set':
      return yield* setSchemaFormatter(schema, rawValue, { ...options, attributes: undefined })
    case 'list':
      return yield* listSchemaFormatter(schema, rawValue, options)
    case 'map':
      return yield* mapSchemaFormatter(schema, rawValue, options)
    case 'record':
      return yield* recordSchemaFormatter(schema, rawValue, options)
    case 'anyOf':
      return yield* anyOfSchemaFormatter(schema, rawValue, options)
  }
}
