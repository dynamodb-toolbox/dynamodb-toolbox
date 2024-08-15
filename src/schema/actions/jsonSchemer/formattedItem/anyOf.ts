import type { AnyOfAttribute, Attribute } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedAttrJSONSchema } from './attribute.js'
import { getFormattedAttrJSONSchema } from './attribute.js'

export type FormattedAnyOfAttrJSONSchema<ATTRIBUTE extends AnyOfAttribute> = ComputeObject<{
  anyOf: FormattedAnyOfAttrJSONSchemaRec<ATTRIBUTE['elements']>
}>

type FormattedAnyOfAttrJSONSchemaRec<
  ATTRIBUTES extends Attribute[],
  RESULTS extends unknown[] = []
> = number extends ATTRIBUTES['length']
  ? FormattedAttrJSONSchema<ATTRIBUTES[number]>[]
  : ATTRIBUTES extends [infer ATTRIBUTES_HEAD, ...infer ATTRIBUTES_TAIL]
    ? ATTRIBUTES_HEAD extends Attribute
      ? ATTRIBUTES_TAIL extends Attribute[]
        ? FormattedAnyOfAttrJSONSchemaRec<
            ATTRIBUTES_TAIL,
            [...RESULTS, FormattedAttrJSONSchema<ATTRIBUTES_HEAD>]
          >
        : never
      : never
    : RESULTS

export const getFormattedAnyOfAttrJSONSchema = <ATTRIBUTE extends AnyOfAttribute>(
  attr: ATTRIBUTE
): FormattedAnyOfAttrJSONSchema<ATTRIBUTE> => ({
  anyOf: attr.elements.map(element =>
    getFormattedAttrJSONSchema(element)
  ) as FormattedAnyOfAttrJSONSchemaRec<ATTRIBUTE['elements']>
})
