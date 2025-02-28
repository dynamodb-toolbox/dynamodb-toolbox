import type { ListSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import { getFormattedValueJSONSchema } from './attribute.js'
import type { FormattedValueJSONSchema } from './attribute.js'

export type FormattedListJSONSchema<ATTRIBUTE extends ListSchema> = ComputeObject<{
  type: 'array'
  items: FormattedValueJSONSchema<ATTRIBUTE['elements']>
}>

export const getFormattedListJSONSchema = <ATTRIBUTE extends ListSchema>(
  attr: ATTRIBUTE
): FormattedListJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedValueJSONSchema<ATTRIBUTE['elements']>(attr.elements)
})
