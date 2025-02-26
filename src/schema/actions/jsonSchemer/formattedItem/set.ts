import type { SetSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedSetJSONSchema<ATTRIBUTE extends SetSchema> = ComputeObject<{
  type: 'array'
  items: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
  uniqueItems: true
}>

export const getFormattedSetAttrJSONSchema = <ATTRIBUTE extends SetSchema>(
  attr: ATTRIBUTE
): FormattedSetJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements),
  uniqueItems: true
})
