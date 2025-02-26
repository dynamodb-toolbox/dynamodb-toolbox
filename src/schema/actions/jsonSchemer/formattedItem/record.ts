import type { RecordSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedRecordJSONSchema<ATTRIBUTE extends RecordSchema> = ComputeObject<{
  type: 'object'
  propertyNames: FormattedAttrJSONSchema<ATTRIBUTE['keys']>
  additionalProperties: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedRecordAttrJSONSchema = <ATTRIBUTE extends RecordSchema>(
  attr: ATTRIBUTE
): FormattedRecordJSONSchema<ATTRIBUTE> => ({
  type: 'object',
  propertyNames: getFormattedAttrJSONSchema<ATTRIBUTE['keys']>(attr.keys),
  additionalProperties: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
