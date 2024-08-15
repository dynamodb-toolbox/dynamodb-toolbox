import type { RecordAttribute } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedRecordAttrJSONSchema<ATTRIBUTE extends RecordAttribute> = ComputeObject<{
  type: 'object'
  propertyNames: FormattedAttrJSONSchema<ATTRIBUTE['keys']>
  additionalProperties: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedRecordAttrJSONSchema = <ATTRIBUTE extends RecordAttribute>(
  attr: ATTRIBUTE
): FormattedRecordAttrJSONSchema<ATTRIBUTE> => ({
  type: 'object',
  propertyNames: getFormattedAttrJSONSchema<ATTRIBUTE['keys']>(attr.keys),
  additionalProperties: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
