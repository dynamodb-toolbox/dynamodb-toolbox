import type { PrimitiveAttribute } from '~/attributes/index.js'

export type FormattedPrimitiveAttrJSONSchema<ATTRIBUTE extends PrimitiveAttribute> =
  ATTRIBUTE extends PrimitiveAttribute<'binary'> ? { type: 'string' } : { type: ATTRIBUTE['type'] }

export const getFormattedPrimitiveAttrJSONSchema = <ATTRIBUTE extends PrimitiveAttribute>(
  attr: ATTRIBUTE
): FormattedPrimitiveAttrJSONSchema<ATTRIBUTE> => {
  type Response = FormattedPrimitiveAttrJSONSchema<ATTRIBUTE>

  if (attr.type === 'binary') {
    return { type: 'string' } as Response
  }

  return { type: attr.type } as Response
}
