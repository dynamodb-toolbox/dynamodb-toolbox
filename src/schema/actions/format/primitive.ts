import type {
  NumberAttribute,
  PrimitiveAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolvedNumberAttribute,
  ResolvedPrimitiveAttribute,
  Transformer
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { If } from '~/types/index.js'
import { validatorsByPrimitiveType } from '~/utils/validation/validatorsByPrimitiveType.js'

import type { MustBeDefined } from './attribute.js'

export type PrimitiveOrNumberAttrFormattedValue<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute
> = PrimitiveAttribute | NumberAttribute extends ATTRIBUTE
  ? ResolvedPrimitiveAttribute | ResolvedNumberAttribute
  :
      | If<MustBeDefined<ATTRIBUTE>, never, undefined>
      | (ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends NumberAttribute
            ? ResolveNumberAttribute<ATTRIBUTE>
            : never)

type PrimitiveAttrRawValueFormatter = <ATTRIBUTE extends PrimitiveAttribute | NumberAttribute>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => PrimitiveOrNumberAttrFormattedValue<ATTRIBUTE>

export const formatPrimitiveAttrRawValue: PrimitiveAttrRawValueFormatter = <
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute
>(
  attribute: ATTRIBUTE,
  rawValue: unknown
) => {
  type Formatted = PrimitiveOrNumberAttrFormattedValue<ATTRIBUTE>

  const validator = validatorsByPrimitiveType[attribute.type]
  if (!validator(rawValue)) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('formatter.invalidAttribute', {
      message: `Invalid attribute detected while formatting${
        path !== undefined ? `: '${path}'` : ''
      }. Should be a ${type}.`,
      path,
      payload: {
        received: rawValue,
        expected: type
      }
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
