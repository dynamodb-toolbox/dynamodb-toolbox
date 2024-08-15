import type { MapAttribute } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { SelectKeys } from '~/types/selectKeys.js'

import { getFormattedAttrJSONSchema } from './attribute.js'
import type { FormattedAttrJSONSchema } from './attribute.js'
import type { RequiredProperties } from './shared.js'

export type FormattedMapAttrJSONSchema<
  ATTRIBUTE extends MapAttribute,
  REQUIRED_PROPERTIES extends string = RequiredProperties<ATTRIBUTE>
> = ComputeObject<
  {
    type: 'object'
    properties: {
      [KEY in SelectKeys<ATTRIBUTE['attributes'], { hidden: false }>]: FormattedAttrJSONSchema<
        ATTRIBUTE['attributes'][KEY]
      >
    }
  } & ([REQUIRED_PROPERTIES] extends [never] ? {} : { required: REQUIRED_PROPERTIES[] })
>

export const getFormattedMapAttrJSONSchema = <ATTRIBUTE extends MapAttribute>(
  attr: ATTRIBUTE
): FormattedMapAttrJSONSchema<ATTRIBUTE> => {
  const displayedAttrEntries = Object.entries(attr.attributes).filter(
    ([, attribute]) => !attribute.hidden
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
  } as FormattedMapAttrJSONSchema<ATTRIBUTE>
}
