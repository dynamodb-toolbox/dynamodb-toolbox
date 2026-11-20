import type { $ZodTuple, $ZodTupleDef, SomeType } from 'zod/v4/core'

import type { TupleSchema, TupleSchema_ } from '~/index.js'
import { tuple } from '~/schema/tuple/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import { fromZodSchema } from './fromZodSchema.js'
import type { FromZodSchemaRec } from './types.js'
import { withMeta, withRefinements } from './utils.js'

/**
 * DDB-TB schema derived from a `zod` tuple schema.
 */
export type FromZodTuple<
  ZOD_SCHEMA extends $ZodTuple,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends $ZodTuple<infer ZOD_SCHEMA_ELEMENTS, infer ZOD_REST>
    ? ROOT extends true
      ? TupleSchema_<
          FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>,
          [ZOD_REST] extends [null] ? Overwrite<PROPS, { strict: true }> : PROPS
        >
      : TupleSchema<
          FromZodSchemaRec<ZOD_SCHEMA_ELEMENTS, false>,
          [ZOD_REST] extends [null] ? Overwrite<PROPS, { strict: true }> : PROPS
        >
    : never

/**
 * Convert a `zod` tuple schema to a DDB-TB schema.
 */
export const fromZodTuple = (zodTuple: SomeType, { items, rest }: $ZodTupleDef): TupleSchema => {
  const elements = items.map(item => fromZodSchema(item))

  return withRefinements(
    withMeta(rest === null ? tuple(...elements).strict() : tuple(...elements), zodTuple),
    zodTuple
  )
}
