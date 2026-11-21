import type { $ZodObject, $ZodObjectDef, SomeType } from 'zod/v4/core'

import type { MapSchema, MapSchema_ } from '~/index.js'
import { map } from '~/schema/map/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` object schema.
 *
 * @debt type "Strictness is dropped: `$strict` and `$strip` are the same type in zod v4, so `z.strictObject` cannot be told apart from `z.object` at the type level. The runtime does carry it over."
 */
export type FromZodObject<
  ZOD_SCHEMA extends $ZodObject,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodObject<infer ZOD_SCHEMA_SHAPE>
    ? ROOT extends true
      ? MapSchema_<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          PROPS
        >
      : MapSchema<
          { [KEY in keyof ZOD_SCHEMA_SHAPE]: FromZodSchema<ZOD_SCHEMA_SHAPE[KEY], false> },
          PROPS
        >
    : never

/**
 * Convert a `zod` object schema to a DDB-TB schema.
 */
export const fromZodObject = (
  zodObject: SomeType,
  { shape, catchall }: $ZodObjectDef
): MapSchema => {
  const attributes = Object.fromEntries(
    Object.entries(shape).map(([key, value]) => [key, fromZodSchema(value)])
  )

  // `z.strictObject` is the only object builder that sets a `never` catchall
  const isStrict = catchall?._zod.def.type === 'never'

  return withRefinements(
    withMeta(isStrict ? map(attributes, { strict: true }) : map(attributes), zodObject),
    zodObject
  )
}
