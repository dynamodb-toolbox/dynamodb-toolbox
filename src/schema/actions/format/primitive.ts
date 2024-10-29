import type { PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatValueOptions } from './options.js'

export function* primitiveAttrFormatter<
  OPTIONS extends FormatValueOptions<PrimitiveAttribute> = {}
>(
  attribute: PrimitiveAttribute,
  rawValue: unknown,
  options: OPTIONS = {} as OPTIONS
): Generator<FormatterYield<PrimitiveAttribute>, FormatterReturn<PrimitiveAttribute>> {
  const { transform = true } = options

  if (!isValidPrimitive(attribute, rawValue)) {
    const { path, type } = attribute

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
    const transformer = attribute.transform as Transformer
    transformedValue = transformer !== undefined ? transformer.format(rawValue) : rawValue
  } else {
    transformedValue = rawValue
  }

  if (attribute.enum !== undefined && !(attribute.enum as unknown[]).includes(transformedValue)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: { received: transformedValue, expected: attribute.enum }
    })
  }

  if (transform) {
    yield transformedValue
  }

  const formattedValue = transformedValue
  return formattedValue
}
