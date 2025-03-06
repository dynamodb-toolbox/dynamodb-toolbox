import type { SetSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './attribute.js'
import { getFormattedValueJSONSchema } from './attribute.js'

export type FormattedSetJSONSchema<SCHEMA extends SetSchema> = ComputeObject<{
  type: 'array'
  items: FormattedValueJSONSchema<SCHEMA['elements']>
  uniqueItems: true
}>

export const getFormattedSetJSONSchema = <SCHEMA extends SetSchema>(
  schema: SCHEMA
): FormattedSetJSONSchema<SCHEMA> => ({
  type: 'array',
  items: getFormattedValueJSONSchema<SCHEMA['elements']>(schema.elements),
  uniqueItems: true
})
