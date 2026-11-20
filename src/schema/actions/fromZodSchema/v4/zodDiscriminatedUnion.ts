import type { $ZodDiscriminatedUnion, $ZodDiscriminatedUnionDef, SomeType } from 'zod/v4/core'

import type { AnyOfSchema, AnyOfSchema_ } from '~/index.js'
import { anyOf } from '~/schema/anyOf/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchemaRec } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` discriminated union schema.
 */
export type FromZodDiscriminatedUnion<
  ZOD_SCHEMA extends $ZodDiscriminatedUnion,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodDiscriminatedUnion<infer ZOD_SCHEMA_ELEMENTS, infer DISCRIMINATOR>
    ? ROOT extends true
      ? AnyOfSchema_<
          FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>,
          Overwrite<PROPS, { discriminator: DISCRIMINATOR }>
        >
      : AnyOfSchema<
          FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>,
          Overwrite<PROPS, { discriminator: DISCRIMINATOR }>
        >
    : never

/**
 * Convert a `zod` discriminated union schema to a DDB-TB schema.
 */
export const fromZodDiscriminatedUnion = (
  zodDiscriminatedUnion: SomeType,
  { options, discriminator }: $ZodDiscriminatedUnionDef
): AnyOfSchema =>
  withRefinements(
    withMeta(
      anyOf(...options.map(option => fromZodSchema(option))).discriminate(discriminator),
      zodDiscriminatedUnion
    ),
    zodDiscriminatedUnion
  )
