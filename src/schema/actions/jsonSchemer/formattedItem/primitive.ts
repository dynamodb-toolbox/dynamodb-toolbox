import type { BinarySchema, PrimitiveSchema } from '~/attributes/index.js'

export type FormattedPrimitiveJSONSchema<ATTRIBUTE extends PrimitiveSchema> =
  ATTRIBUTE extends BinarySchema ? { type: 'string' } : { type: ATTRIBUTE['type'] }

export const getFormattedPrimitiveAttrJSONSchema = <ATTRIBUTE extends PrimitiveSchema>(
  attr: ATTRIBUTE
): FormattedPrimitiveJSONSchema<ATTRIBUTE> => {
  type Response = FormattedPrimitiveJSONSchema<ATTRIBUTE>

  if (attr.type === 'binary') {
    return { type: 'string' } as Response
  }

  return { type: attr.type } as Response
}
