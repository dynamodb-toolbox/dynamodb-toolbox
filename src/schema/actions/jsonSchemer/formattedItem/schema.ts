import type { Schema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { OmitKeys } from '~/types/omitKeys.js'

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
      [KEY in OmitKeys<SCHEMA['attributes'], { state: { hidden: true } }>]: FormattedAttrJSONSchema<
        SCHEMA['attributes'][KEY]
      >
    }
  } & ([REQUIRED_PROPERTIES] extends [never] ? {} : { required: REQUIRED_PROPERTIES[] })
>

export const getFormattedItemJSONSchema = <SCHEMA extends Schema>(
  schema: SCHEMA
): FormattedItemJSONSchema<SCHEMA> => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.state.hidden
  )

  const requiredProperties = displayedAttrEntries
    .filter(([, { state }]) => state.required !== 'never')
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
