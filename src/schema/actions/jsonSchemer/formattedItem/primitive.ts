import type { BinarySchema, PrimitiveSchema } from '~/schema/index.js'

export type FormattedPrimitiveJSONSchema<SCHEMA extends PrimitiveSchema> =
  SCHEMA extends BinarySchema ? { type: 'string' } : { type: SCHEMA['type'] }

export const getFormattedPrimitiveJSONSchema = <SCHEMA extends PrimitiveSchema>(
  schema: SCHEMA
): FormattedPrimitiveJSONSchema<SCHEMA> => {
  type Response = FormattedPrimitiveJSONSchema<SCHEMA>

  if (schema.type === 'binary') {
    return { type: 'string' } as Response
  }

  return { type: schema.type } as Response
}
