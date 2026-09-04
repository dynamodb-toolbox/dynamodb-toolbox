import type { SetSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'
import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

/**
 * JSON Schema of a formatted `set` value.
 */
export type FormattedSetJSONSchema<SCHEMA extends SetSchema> = ComputeObject<
  JSONSchemaMeta<SCHEMA> & {
    type: 'array'
    items: FormattedValueJSONSchema<SCHEMA['elements']>
    uniqueItems: true
  }
>

/**
 * Build the JSON Schema of a formatted `set` value.
 */
export const getFormattedSetJSONSchema = <SCHEMA extends SetSchema>(
  schema: SCHEMA
): FormattedSetJSONSchema<SCHEMA> => ({
  ...getJSONSchemaMeta(schema),
  type: 'array',
  items: getFormattedValueJSONSchema<SCHEMA['elements']>(schema.elements),
  uniqueItems: true
})
