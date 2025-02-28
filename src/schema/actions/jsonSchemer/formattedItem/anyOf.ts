import type { AnyOfSchema, AttrSchema } from '~/attributes/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './attribute.js'
import { getFormattedValueJSONSchema } from './attribute.js'

export type FormattedAnyOfJSONSchema<SCHEMA extends AnyOfSchema> = ComputeObject<{
  anyOf: MapFormattedValueJSONSchema<SCHEMA['elements']>
}>

type MapFormattedValueJSONSchema<
  SCHEMAS extends AttrSchema[],
  RESULTS extends unknown[] = []
> = number extends SCHEMAS['length']
  ? FormattedValueJSONSchema<SCHEMAS[number]>[]
  : SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
    ? SCHEMAS_HEAD extends AttrSchema
      ? SCHEMAS_TAIL extends AttrSchema[]
        ? MapFormattedValueJSONSchema<
            SCHEMAS_TAIL,
            [...RESULTS, FormattedValueJSONSchema<SCHEMAS_HEAD>]
          >
        : never
      : never
    : RESULTS

export const getFormattedAnyOfJSONSchema = <SCHEMA extends AnyOfSchema>(
  schema: SCHEMA
): FormattedAnyOfJSONSchema<SCHEMA> => ({
  anyOf: schema.elements.map(element =>
    getFormattedValueJSONSchema(element)
  ) as MapFormattedValueJSONSchema<SCHEMA['elements']>
})
