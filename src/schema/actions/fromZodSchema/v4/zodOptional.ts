import type { $ZodOptional, $ZodOptionalDef, SomeType } from 'zod/v4/core'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` optional schema.
 */
export type FromZodOptional<
  ZOD_SCHEMA extends $ZodOptional,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodOptional<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { required: 'never' }>>
    : never

/**
 * Convert a `zod` optional schema to a DDB-TB schema.
 */
export const fromZodOptional = (zodOptional: SomeType, { innerType }: $ZodOptionalDef): Schema =>
  withRefinements(withMeta(fromZodSchema(innerType).optional(), zodOptional), zodOptional)
