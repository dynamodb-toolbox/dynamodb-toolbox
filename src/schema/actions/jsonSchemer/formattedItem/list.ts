import type { ListAttribute } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import { getFormattedAttrJSONSchema } from './attribute.js'
import type { FormattedAttrJSONSchema } from './attribute.js'

export type FormattedListAttrJSONSchema<ATTRIBUTE extends ListAttribute> = ComputeObject<{
  type: 'array'
  items: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedListAttrJSONSchema = <ATTRIBUTE extends ListAttribute>(
  attr: ATTRIBUTE
): FormattedListAttrJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
