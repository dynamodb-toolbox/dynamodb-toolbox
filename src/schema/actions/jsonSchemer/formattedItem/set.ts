import type { SetSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './attribute.js'
import { getFormattedValueJSONSchema } from './attribute.js'

export type FormattedSetJSONSchema<ATTRIBUTE extends SetSchema> = ComputeObject<{
  type: 'array'
  items: FormattedValueJSONSchema<ATTRIBUTE['elements']>
  uniqueItems: true
}>

export const getFormattedSetJSONSchema = <ATTRIBUTE extends SetSchema>(
  attr: ATTRIBUTE
): FormattedSetJSONSchema<ATTRIBUTE> => ({
  type: 'array',
  items: getFormattedValueJSONSchema<ATTRIBUTE['elements']>(attr.elements),
  uniqueItems: true
})
