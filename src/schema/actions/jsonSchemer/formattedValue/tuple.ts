import type { TupleSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchemaRec } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'
import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

/**
 * JSON Schema of a formatted `tuple` value.
 */
export type FormattedTupleJSONSchema<SCHEMA extends TupleSchema> = ComputeObject<
  JSONSchemaMeta<SCHEMA> & {
    type: 'array'
    items: FormattedValueJSONSchemaRec<SCHEMA['elements']>
    minLength: SCHEMA['elements']['length']
    maxLength: SCHEMA['elements']['length']
  }
>

/**
 * Build the JSON Schema of a formatted `tuple` value.
 */
export const getFormattedTupleJSONSchema = <SCHEMA extends TupleSchema>(
  schema: SCHEMA
): FormattedTupleJSONSchema<SCHEMA> => ({
  ...getJSONSchemaMeta(schema),
  type: 'array',
  items: schema.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as FormattedValueJSONSchemaRec<SCHEMA['elements']>,
  minLength: schema.elements.length,
  maxLength: schema.elements.length
})
