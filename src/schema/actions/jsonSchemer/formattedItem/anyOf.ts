import type { AnyOfSchema, AttrSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './attribute.js'
import { getFormattedValueJSONSchema } from './attribute.js'

export type FormattedAnyOfJSONSchema<ATTRIBUTE extends AnyOfSchema> = ComputeObject<{
  anyOf: MapFormattedValueJSONSchema<ATTRIBUTE['elements']>
}>

type MapFormattedValueJSONSchema<
  ATTRIBUTES extends AttrSchema[],
  RESULTS extends unknown[] = []
> = number extends ATTRIBUTES['length']
  ? FormattedValueJSONSchema<ATTRIBUTES[number]>[]
  : ATTRIBUTES extends [infer ATTRIBUTES_HEAD, ...infer ATTRIBUTES_TAIL]
    ? ATTRIBUTES_HEAD extends AttrSchema
      ? ATTRIBUTES_TAIL extends AttrSchema[]
        ? MapFormattedValueJSONSchema<
            ATTRIBUTES_TAIL,
            [...RESULTS, FormattedValueJSONSchema<ATTRIBUTES_HEAD>]
          >
        : never
      : never
    : RESULTS

export const getFormattedAnyOfJSONSchema = <ATTRIBUTE extends AnyOfSchema>(
  attr: ATTRIBUTE
): FormattedAnyOfJSONSchema<ATTRIBUTE> => ({
  anyOf: attr.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as MapFormattedValueJSONSchema<ATTRIBUTE['elements']>
})
