import type { PrimitiveSchema } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* primitiveAttrFormatter(
  attribute: PrimitiveSchema,
  rawValue: unknown,
  { format = true, transform = true, valuePath = [] }: FormatAttrValueOptions<PrimitiveSchema> = {}
): Generator<
  FormatterYield<PrimitiveSchema, FormatAttrValueOptions<PrimitiveSchema>>,
  FormatterReturn<PrimitiveSchema, FormatAttrValueOptions<PrimitiveSchema>>
> {
  const { props } = attribute
  if (!isValidPrimitive(attribute, rawValue)) {
    const { type } = attribute
    const path = formatValuePath(valuePath)

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
    const path = formatValuePath(valuePath)

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
