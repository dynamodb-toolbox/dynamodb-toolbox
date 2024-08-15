import type { SetAttribute } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedSetAttrJSONSchema<ATTRIBUTE extends SetAttribute> = ComputeObject<{
  type: 'array'
  items: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
  uniqueItems: true
}>

export const getFormattedSetAttrJSONSchema = <ATTRIBUTE extends SetAttribute>(
  attr: ATTRIBUTE
): FormattedSetAttrJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements),
  uniqueItems: true
})
