import type { $ZodUnion, $ZodUnionDef, SomeType } from 'zod/v4/core'

import type { AnyOfSchema, AnyOfSchema_ } from '~/index.js'
import { anyOf } from '~/schema/anyOf/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchemaRec } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` union schema.
 */
export type FromZodUnion<
  ZOD_SCHEMA extends $ZodUnion,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodUnion<infer ZOD_SCHEMA_ELEMENTS>
    ? ROOT extends true
      ? AnyOfSchema_<FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
      : AnyOfSchema<FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>, PROPS>
    : never

/**
 * Convert a `zod` union schema to a DDB-TB schema.
 */
export const fromZodUnion = (zodUnion: SomeType, { options }: $ZodUnionDef): AnyOfSchema =>
  withRefinements(
    withMeta(anyOf(...options.map(option => fromZodSchema(option))), zodUnion),
    zodUnion
  )
