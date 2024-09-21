import type { NumberAttribute, PrimitiveAttribute, StringAttribute } from '~/attributes/index.js'

export type FormattedPrimitiveAttrV2JSONSchema<
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute | StringAttribute
> =
  ATTRIBUTE extends PrimitiveAttribute<'binary'> ? { type: 'string' } : { type: ATTRIBUTE['type'] }

export const getFormattedPrimitiveAttrV2JSONSchema = <
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute | StringAttribute
>(
  attr: ATTRIBUTE
): FormattedPrimitiveAttrV2JSONSchema<ATTRIBUTE> => {
  type Response = FormattedPrimitiveAttrV2JSONSchema<ATTRIBUTE>

  if (attr.type === 'binary') {
    return { type: 'string' } as Response
  }

  return { type: attr.type } as Response
}
