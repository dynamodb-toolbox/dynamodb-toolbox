import type { AnySchema } from '~/schema/index.js'

import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

export type FormattedAnyJSONSchema<SCHEMA extends AnySchema> = JSONSchemaMeta<SCHEMA>

export const getFormattedAnyJSONSchema = <SCHEMA extends AnySchema>(
  schema: SCHEMA
): FormattedAnyJSONSchema<SCHEMA> => getJSONSchemaMeta(schema)
