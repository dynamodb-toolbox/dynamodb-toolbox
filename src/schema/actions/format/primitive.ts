import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatArrayPath } from '~/schema/actions/utils/formatArrayPath.js'
import type { PrimitiveSchema } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* primitiveSchemaFormatter(
  schema: PrimitiveSchema,
  rawValue: unknown,
  { format = true, transform = true, valuePath }: FormatAttrValueOptions<PrimitiveSchema> = {}
): Generator<
  FormatterYield<PrimitiveSchema, FormatAttrValueOptions<PrimitiveSchema>>,
  FormatterReturn<PrimitiveSchema, FormatAttrValueOptions<PrimitiveSchema>>
> {
  const { props } = schema
  if (!isValidPrimitive(schema, rawValue)) {
    const { type } = schema
    const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  let transformedValue = undefined
  if (transform) {
    const transformer = props.transform as Transformer | undefined
    transformedValue = transformer !== undefined ? transformer.decode(rawValue) : rawValue
  } else {
    transformedValue = rawValue
  }

  if (props.enum !== undefined && !(props.enum as unknown[]).includes(transformedValue)) {
    const path = valuePath !== undefined ? formatArrayPath(valuePath) : undefined

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be one of: ${props.enum.map(String).join(', ')}.`,
      path,
      payload: { received: transformedValue, expected: props.enum }
    })
  }

  if (transform) {
    if (format) {
      yield transformedValue
    } else {
      return transformedValue
    }
  }

  const formattedValue = transformedValue
  return formattedValue
}
