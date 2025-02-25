import type { PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { FormatterReturn, FormatterYield } from './formatter.js'
import type { FormatAttrValueOptions } from './options.js'

export function* primitiveAttrFormatter(
  attribute: PrimitiveAttribute,
  rawValue: unknown,
  {
    format = true,
    transform = true,
    valuePath = []
  }: FormatAttrValueOptions<PrimitiveAttribute> = {}
): Generator<
  FormatterYield<PrimitiveAttribute, FormatAttrValueOptions<PrimitiveAttribute>>,
  FormatterReturn<PrimitiveAttribute, FormatAttrValueOptions<PrimitiveAttribute>>
> {
  const { state } = attribute
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
    const transformer = state.transform as Transformer | undefined
    transformedValue = transformer !== undefined ? transformer.decode(rawValue) : rawValue
  } else {
    transformedValue = rawValue
  }

  if (state.enum !== undefined && !(state.enum as unknown[]).includes(transformedValue)) {
    const path = formatValuePath(valuePath)

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be one of: ${state.enum.map(String).join(', ')}.`,
      path,
      payload: { received: transformedValue, expected: state.enum }
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
