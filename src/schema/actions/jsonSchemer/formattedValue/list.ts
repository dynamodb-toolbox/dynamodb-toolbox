import type { ListSchema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import { getFormattedValueJSONSchema } from './schema.js'
import type { FormattedValueJSONSchema } from './schema.js'

export type FormattedListJSONSchema<SCHEMA extends ListSchema> = ComputeObject<{
  type: 'array'
  items: FormattedValueJSONSchema<SCHEMA['elements']>
}>

export const getFormattedListJSONSchema = <SCHEMA extends ListSchema>(
  schema: SCHEMA
): FormattedListJSONSchema<SCHEMA> => ({
  type: 'array',
  items: getFormattedValueJSONSchema<SCHEMA['elements']>(schema.elements)
})
