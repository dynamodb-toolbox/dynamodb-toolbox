import type { AnyOfSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchemaRec } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'
import type { JSONSchemaMeta } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

export type FormattedAnyOfJSONSchema<SCHEMA extends AnyOfSchema> = ComputeObject<
  JSONSchemaMeta<SCHEMA> & {
    anyOf: FormattedValueJSONSchemaRec<SCHEMA['elements']>
  }
>

export const getFormattedAnyOfJSONSchema = <SCHEMA extends AnyOfSchema>(
  schema: SCHEMA
): FormattedAnyOfJSONSchema<SCHEMA> => ({
  ...getJSONSchemaMeta(schema),
  anyOf: schema.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as FormattedValueJSONSchemaRec<SCHEMA['elements']>
})
