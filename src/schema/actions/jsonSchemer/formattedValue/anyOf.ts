import type { AnyOfSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchemaRec } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'

export type FormattedAnyOfJSONSchema<SCHEMA extends AnyOfSchema> = ComputeObject<{
  anyOf: FormattedValueJSONSchemaRec<SCHEMA['elements']>
}>

export const getFormattedAnyOfJSONSchema = <SCHEMA extends AnyOfSchema>(
  schema: SCHEMA
): FormattedAnyOfJSONSchema<SCHEMA> => ({
  anyOf: schema.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as FormattedValueJSONSchemaRec<SCHEMA['elements']>
})
