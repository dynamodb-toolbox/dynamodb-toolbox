import type { BinarySchema, PrimitiveSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

/**
 * JSON Schema of a formatted primitive value.
 */
export type FormattedPrimitiveJSONSchema<SCHEMA extends PrimitiveSchema> = ComputeObject<
  JSONSchemaMeta<SCHEMA> &
    (SCHEMA extends BinarySchema ? { type: 'string' } : { type: SCHEMA['type'] })
>

/**
 * Build the JSON Schema of a formatted primitive value.
 */
export const getFormattedPrimitiveJSONSchema = <SCHEMA extends PrimitiveSchema>(
  schema: SCHEMA
): FormattedPrimitiveJSONSchema<SCHEMA> => {
  const meta = getJSONSchemaMeta(schema)

  if (schema.type === 'binary') {
    return { ...meta, type: 'string' } as FormattedPrimitiveJSONSchema<SCHEMA>
  }

  return { ...meta, type: schema.type } as FormattedPrimitiveJSONSchema<SCHEMA>
}
