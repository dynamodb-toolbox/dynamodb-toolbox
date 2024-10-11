import type { PrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { FormattedValue } from '~/schema/index.js'
import type { Transformer } from '~/transformers/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

type PrimitiveAttrRawValueFormatter = <ATTRIBUTE extends PrimitiveAttribute>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => FormattedValue<PrimitiveAttribute>

export const formatPrimitiveAttrRawValue: PrimitiveAttrRawValueFormatter = <
  ATTRIBUTE extends PrimitiveAttribute
>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => {
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

  const rawPrimitive = rawValue
  const transformer = attribute.transform as Transformer
  const formattedValue = transformer !== undefined ? transformer.format(rawPrimitive) : rawPrimitive

  if (attribute.enum !== undefined && !(attribute.enum as unknown[]).includes(formattedValue)) {
    const { path } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be one of: ${attribute.enum.map(String).join(', ')}.`,
      path,
      payload: { received: formattedValue, expected: attribute.enum }
    })
  }

  return formattedValue
}
