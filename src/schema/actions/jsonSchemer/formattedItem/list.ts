import type { ListSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import { getFormattedAttrJSONSchema } from './attribute.js'
import type { FormattedAttrJSONSchema } from './attribute.js'

export type FormattedListJSONSchema<ATTRIBUTE extends ListSchema> = ComputeObject<{
  type: 'array'
  items: FormattedAttrJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedListAttrJSONSchema = <ATTRIBUTE extends ListSchema>(
  attr: ATTRIBUTE
): FormattedListJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedAttrJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
