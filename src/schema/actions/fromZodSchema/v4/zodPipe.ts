import type { $ZodPipe, $ZodPipeDef, $ZodTransform, SomeType } from 'zod/v4/core'

import type { Schema } from '~/schema/types/schema.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchema } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` pipe schema.
 */
export type FromZodPipe<
  ZOD_SCHEMA extends SomeType,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodPipe<infer ZOD_SCHEMA_IN, infer ZOD_SCHEMA_OUT>
    ? ZOD_SCHEMA_IN extends $ZodTransform
      ? FromZodSchema<ZOD_SCHEMA_OUT, ROOT, PROPS>
      : FromZodSchema<ZOD_SCHEMA_IN, ROOT, PROPS>
    : never

/**
 * Convert a `zod` pipe schema to a DDB-TB schema.
 *
 * @debt feature "The transform side is dropped: a transform is not reversible, so it cannot be a DDB-TB transformer"
 */
export const fromZodPipe = (zodPipe: SomeType, { in: input, out: output }: $ZodPipeDef): Schema =>
  /**
   * `.transform()` pipes a schema into a transform and `.preprocess()` does the reverse: either
   * way the schema side is what DDB-TB stores, and the transform is dropped.
   */
  withRefinements(
    withMeta(fromZodSchema(input._zod.def.type === 'transform' ? output : input), zodPipe),
    zodPipe
  )
