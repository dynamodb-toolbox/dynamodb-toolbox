import type { $ZodDefault, $ZodDefaultDef, SomeType } from 'zod/v4/core'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` default schema.
 */
export type FromZodDefault<
  ZOD_SCHEMA extends $ZodDefault,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodDefault<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { putDefault: unknown }>>
    : never

/**
 * Convert a `zod` default schema to a DDB-TB schema.
 */
export const fromZodDefault = (
  zodDefault: SomeType,
  { innerType, defaultValue }: $ZodDefaultDef
): Schema =>
  // In zod v4, `defaultValue` is the default value itself, no longer a thunk returning it
  withRefinements(withMeta(fromZodSchema(innerType).default(defaultValue), zodDefault), zodDefault)
