import type { Schema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'
import type { RequiredProperties } from './shared.js'

export type FormattedItemJSONSchema<
  SCHEMA extends Schema,
  REQUIRED_PROPERTIES extends string = RequiredProperties<SCHEMA>
> = ComputeObject<
  {
    type: 'object'
    properties: {
      [KEY in SelectKeys<SCHEMA['attributes'], { hidden: false }>]: FormattedAttrJSONSchema<
        SCHEMA['attributes'][KEY]
      >
    }
  } & ([REQUIRED_PROPERTIES] extends [never] ? {} : { required: REQUIRED_PROPERTIES[] })
>

export const getFormattedItemJSONSchema = <SCHEMA extends Schema>(
  schema: SCHEMA
): FormattedItemJSONSchema<SCHEMA> => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attribute]) => !attribute.hidden
  )

  const requiredProperties = displayedAttrEntries
    .filter(([, { required }]) => required === 'atLeastOnce' || required === 'always')
    .map(([attributeName]) => attributeName)

  return {
    type: 'object',
    properties: Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        getFormattedAttrJSONSchema(attribute)
      ])
    ),
    ...(requiredProperties.length > 0 ? { required: requiredProperties } : {})
  } as FormattedItemJSONSchema<SCHEMA>
}
