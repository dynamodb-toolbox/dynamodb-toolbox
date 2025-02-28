import type { RecordSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './attribute.js'
import { getFormattedValueJSONSchema } from './attribute.js'

export type FormattedRecordJSONSchema<ATTRIBUTE extends RecordSchema> = ComputeObject<{
  type: 'object'
  propertyNames: FormattedValueJSONSchema<ATTRIBUTE['keys']>
  additionalProperties: FormattedValueJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedRecordAttrJSONSchema = <ATTRIBUTE extends RecordSchema>(
  attr: ATTRIBUTE
): FormattedRecordJSONSchema<ATTRIBUTE> => ({
  type: 'object',
  propertyNames: getFormattedValueJSONSchema<ATTRIBUTE['keys']>(attr.keys),
  additionalProperties: getFormattedValueJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
