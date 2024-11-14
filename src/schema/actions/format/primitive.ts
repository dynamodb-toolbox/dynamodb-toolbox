import type { PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* primitiveAttrFormatter(
  attribute: PrimitiveAttribute,
  rawValue: unknown,
  options: FormatValueOptions<PrimitiveAttribute> = {}
): Generator<
  FormatterYield<PrimitiveAttribute, FormatValueOptions<PrimitiveAttribute>>,
  FormatterReturn<PrimitiveAttribute, FormatValueOptions<PrimitiveAttribute>>
> {
  const { format = true, transform = true } = options

  if (!isValidPrimitive(attribute, rawValue)) {
    const { path, type, savedAs } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }${savedAs !== undefined ? ` (saved as '${savedAs}')` : ''}. Should be a ${type}.`,
      path,
      payload: { received: rawValue, expected: type }
    })
  }

  let transformedValue = undefined
  if (transform) {
    const transformer = attribute.transform as Transformer
    transformedValue = transformer !== undefined ? transformer.format(rawValue) : rawValue
  } else {
    transformedValue = rawValue
  }

  if (attribute.enum !== undefined && !(attribute.enum as unknown[]).includes(transformedValue)) {
    const { path, savedAs } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }${savedAs !== undefined ? ` (saved as '${savedAs}')` : ''}. Should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: { received: transformedValue, expected: attribute.enum }
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
