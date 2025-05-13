import type { RecordSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'

export type FormattedRecordJSONSchema<SCHEMA extends RecordSchema> = ComputeObject<{
  type: 'object'
  propertyNames: FormattedValueJSONSchema<SCHEMA['keys']>
  additionalProperties: FormattedValueJSONSchema<SCHEMA['elements']>
}>

export const getFormattedRecordJSONSchema = <SCHEMA extends RecordSchema>(
  schema: SCHEMA
): FormattedRecordJSONSchema<SCHEMA> => ({
  type: 'object',
  propertyNames: getFormattedValueJSONSchema<SCHEMA['keys']>(schema.keys),
  additionalProperties: getFormattedValueJSONSchema<SCHEMA['elements']>(schema.elements)
})
