import type { AnySchema } from '~/schema/index.js'

import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

/**
 * JSON Schema of a formatted `any` value.
 */
export type FormattedAnyJSONSchema<SCHEMA extends AnySchema> = JSONSchemaMeta<SCHEMA>

/**
 * Build the JSON Schema of a formatted `any` value.
 */
export const getFormattedAnyJSONSchema = <SCHEMA extends AnySchema>(
  schema: SCHEMA
): FormattedAnyJSONSchema<SCHEMA> => getJSONSchemaMeta(schema)
