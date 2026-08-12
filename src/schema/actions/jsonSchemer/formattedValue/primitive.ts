import type { BinarySchema, PrimitiveSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

export type FormattedPrimitiveJSONSchema<SCHEMA extends PrimitiveSchema> = ComputeObject<
  JSONSchemaMeta<SCHEMA> &
    (SCHEMA extends BinarySchema ? { type: 'string' } : { type: SCHEMA['type'] })
>

export const getFormattedPrimitiveJSONSchema = <SCHEMA extends PrimitiveSchema>(
  schema: SCHEMA
): FormattedPrimitiveJSONSchema<SCHEMA> => {
  type Response = FormattedPrimitiveJSONSchema<SCHEMA>

  const meta = getJSONSchemaMeta(schema)

  if (schema.type === 'binary') {
    return { ...meta, type: 'string' } as Response
  }

  return { ...meta, type: schema.type } as Response
}
