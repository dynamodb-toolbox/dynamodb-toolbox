import type { TupleSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchemaRec } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'

export type FormattedTupleJSONSchema<SCHEMA extends TupleSchema> = ComputeObject<{
  type: 'array'
  items: FormattedValueJSONSchemaRec<SCHEMA['elements']>
  minLength: SCHEMA['elements']['length']
  maxLength: SCHEMA['elements']['length']
}>

export const getFormattedTupleJSONSchema = <SCHEMA extends TupleSchema>(
  schema: SCHEMA
): FormattedTupleJSONSchema<SCHEMA> => ({
  type: 'array',
  items: schema.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as FormattedValueJSONSchemaRec<SCHEMA['elements']>,
  minLength: schema.elements.length,
  maxLength: schema.elements.length
})
