import type { ZodOptional, ZodTypeAny } from 'zod'

import type { Schema } from '~/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'
import { withMeta } from './utils.js'

/**
 * Any `zod` optional schema.
 */
export type ZodOptionalAny = ZodOptional<ZodTypeAny>

/**
 * DDB-TB schema derived from a `zod` optional schema.
 */
export type FromZodOptional<
  ZOD_SCHEMA extends ZodOptional<ZodTypeAny>,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodOptional<infer UNWRAPPED_ZOD_SCHEMA>
    ? FromZodSchema<UNWRAPPED_ZOD_SCHEMA, ROOT, Overwrite<PROPS, { required: 'never' }>>
    : never

/**
 * Convert a `zod` optional schema to a DDB-TB schema.
 */
export const fromZodOptional = (zodSchema: ZodOptionalAny): Schema =>
  withMeta(fromZodSchema(zodSchema.unwrap()).optional(), zodSchema)
