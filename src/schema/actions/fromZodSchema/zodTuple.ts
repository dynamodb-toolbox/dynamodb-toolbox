import type { ZodTuple, ZodTypeAny } from 'zod'

import type { TupleSchema, TupleSchema_ } from '~/index.js'
import { tuple } from '~/schema/tuple/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { FromZodSchemaRec } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'
import { withMeta } from './utils.js'

/**
 * Any `zod` tuple schema.
 */
export type ZodTupleAny = ZodTuple<[ZodTypeAny, ...ZodTypeAny[]], ZodTypeAny | null>

/**
 * DDB-TB schema derived from a `zod` tuple schema.
 */
export type FromZodTuple<
  ZOD_SCHEMA extends ZodTupleAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodTuple<infer ELEMENT_ZOD_SCHEMAS, infer ZOD_REST>
    ? ROOT extends true
      ? TupleSchema_<
          FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>,
          [ZOD_REST] extends [null] ? Overwrite<PROPS, { strict: true }> : PROPS
        >
      : TupleSchema<
          FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>,
          [ZOD_REST] extends [null] ? Overwrite<PROPS, { strict: true }> : PROPS
        >
    : never

/**
 * Convert a `zod` tuple schema to a DDB-TB schema.
 */
export const fromZodTuple = (zodTuple: ZodTupleAny): TupleSchema => {
  const elements = zodTuple.items.map(item => fromZodSchema(item))

  return withMeta(
    zodTuple._def.rest === null ? tuple(...elements).strict() : tuple(...elements),
    zodTuple
  )
}
