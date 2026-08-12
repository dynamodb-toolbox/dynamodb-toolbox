import type { ItemSchema } from '~/schema/item/index.js'
import type { ComputeObject } from '~/types/computeObject.js'
import type { OmitKeys } from '~/types/omitKeys.js'

import type { FormattedValueJSONSchema } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'
import type { JSONSchemaMeta, RequiredProperties } from './utils.js'
import { getJSONSchemaMeta } from './utils.js'

export type FormattedItemJSONSchema<
  SCHEMA extends ItemSchema,
  REQUIRED_PROPERTIES extends string = RequiredProperties<SCHEMA>
> = ComputeObject<
  JSONSchemaMeta<SCHEMA> & {
    type: 'object'
    properties: {
      [KEY in OmitKeys<
        SCHEMA['attributes'],
        { props: { hidden: true } }
      >]: FormattedValueJSONSchema<SCHEMA['attributes'][KEY]>
    }
  } & ([REQUIRED_PROPERTIES] extends [never] ? {} : { required: REQUIRED_PROPERTIES[] }) &
    (SCHEMA['props'] extends { strict: true } ? { additionalProperties: false } : {})
>

export const getFormattedItemJSONSchema = <SCHEMA extends ItemSchema>(
  schema: SCHEMA
): FormattedItemJSONSchema<SCHEMA> => {
  const displayedAttrEntries = Object.entries(schema.attributes).filter(
    ([, attr]) => !attr.props.hidden
  )

  const requiredProperties = displayedAttrEntries
    .filter(([, { props }]) => props.required !== 'never')
    .map(([attributeName]) => attributeName)

  return {
    ...getJSONSchemaMeta(schema),
    type: 'object',
    properties: Object.fromEntries(
      displayedAttrEntries.map(([attributeName, attribute]) => [
        attributeName,
        getFormattedValueJSONSchema(attribute)
      ])
    ),
    ...(requiredProperties.length > 0 ? { required: requiredProperties } : {}),
    ...(schema.props.strict ? { additionalProperties: false } : {})
  } as FormattedItemJSONSchema<SCHEMA>
}
