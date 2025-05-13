import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { ComputeObject } from '~/types/computeObject.js'

import type { FormattedValueJSONSchema } from './schema.js'
import { getFormattedValueJSONSchema } from './schema.js'

export type FormattedAnyOfJSONSchema<SCHEMA extends AnyOfSchema> = ComputeObject<{
  anyOf: MapFormattedValueJSONSchema<SCHEMA['elements']>
}>

type MapFormattedValueJSONSchema<
  SCHEMAS extends Schema[],
  RESULTS extends unknown[] = []
> = number extends SCHEMAS['length']
  ? FormattedValueJSONSchema<SCHEMAS[number]>[]
  : SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
    ? SCHEMAS_HEAD extends Schema
      ? SCHEMAS_TAIL extends Schema[]
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
