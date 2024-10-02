import type { PrimitiveAttribute, ResolvePrimitiveAttribute } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Transformer } from '~/transformers/index.js'
import type { If } from '~/types/index.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { MustBeDefined } from './attribute.js'

export type PrimitiveAttrFormattedValue<ATTRIBUTE extends PrimitiveAttribute> =
  | If<MustBeDefined<ATTRIBUTE>, never, undefined>
  | ResolvePrimitiveAttribute<ATTRIBUTE>

type PrimitiveAttrRawValueFormatter = <ATTRIBUTE extends PrimitiveAttribute>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => PrimitiveAttrFormattedValue<ATTRIBUTE>

export const formatPrimitiveAttrRawValue: PrimitiveAttrRawValueFormatter = <
  ATTRIBUTE extends PrimitiveAttribute
>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => {
  type Formatted = PrimitiveAttrFormattedValue<ATTRIBUTE>

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

  return formattedValue as Formatted
}
