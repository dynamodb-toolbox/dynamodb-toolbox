import type { AnyOfSchema, AttrSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedAnyOfJSONSchema<ATTRIBUTE extends AnyOfSchema> = ComputeObject<{
  anyOf: FormattedAnyOfAttrJSONSchemaRec<ATTRIBUTE['elements']>
}>

type FormattedAnyOfAttrJSONSchemaRec<
  ATTRIBUTES extends AttrSchema[],
  RESULTS extends unknown[] = []
> = number extends ATTRIBUTES['length']
  ? FormattedAttrJSONSchema<ATTRIBUTES[number]>[]
  : ATTRIBUTES extends [infer ATTRIBUTES_HEAD, ...infer ATTRIBUTES_TAIL]
    ? ATTRIBUTES_HEAD extends AttrSchema
      ? ATTRIBUTES_TAIL extends AttrSchema[]
        ? FormattedAnyOfAttrJSONSchemaRec<
            ATTRIBUTES_TAIL,
            [...RESULTS, FormattedAttrJSONSchema<ATTRIBUTES_HEAD>]
          >
        : never
      : never
    : RESULTS

export const getFormattedAnyOfAttrJSONSchema = <ATTRIBUTE extends AnyOfSchema>(
  attr: ATTRIBUTE
): FormattedAnyOfJSONSchema<ATTRIBUTE> => ({
  anyOf: attr.elements.map(element =>
    getFormattedAttrJSONSchema(element)
  ) as FormattedAnyOfAttrJSONSchemaRec<ATTRIBUTE['elements']>
})
