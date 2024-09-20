import type { NumberAttribute, PrimitiveAttribute } from '~/attributes/index.js'

export type FormattedPrimitiveOrNumberAttrJSONSchema<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute
> =
  ATTRIBUTE extends PrimitiveAttribute<'binary'> ? { type: 'string' } : { type: ATTRIBUTE['type'] }

export const getFormattedPrimitiveOrNumberAttrJSONSchema = <
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute
>(
  attr: ATTRIBUTE
): FormattedPrimitiveOrNumberAttrJSONSchema<ATTRIBUTE> => {
  type Response = FormattedPrimitiveOrNumberAttrJSONSchema<ATTRIBUTE>

  if (attr.type === 'binary') {
    return { type: 'string' } as Response
  }

  return { type: attr.type } as Response
}
