import type { MapSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'
import type { RequiredProperties } from './shared.js'

export type FormattedMapJSONSchema<
  ATTRIBUTE extends MapSchema,
  REQUIRED_PROPERTIES extends string = RequiredProperties<ATTRIBUTE>
> = ComputeObject<
  {
    type: 'object'
    properties: {
      [KEY in OmitKeys<
        ATTRIBUTE['attributes'],
        { state: { hidden: true } }
      >]: FormattedAttrJSONSchema<ATTRIBUTE['attributes'][KEY]>
    }
  } & ([REQUIRED_PROPERTIES] extends [never] ? {} : { required: REQUIRED_PROPERTIES[] })
>

export const getFormattedMapAttrJSONSchema = <ATTRIBUTE extends MapSchema>(
  attr: ATTRIBUTE
): FormattedMapJSONSchema<ATTRIBUTE> => {
  const displayedAttrEntries = Object.entries(attr.attributes).filter(
    ([, attr]) => !attr.state.hidden
  )

  const requiredProperties = displayedAttrEntries.map(([attributeName]) => attributeName)

  return {
    type: 'object',
    properties: Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        getFormattedAttrJSONSchema(attribute)
      ])
    ),
    ...(requiredProperties.length > 0 ? { required: requiredProperties } : {})
  } as FormattedMapJSONSchema<ATTRIBUTE>
}
