import type { ZodTuple, ZodTypeAny } from 'zod'

import type { TupleSchema, TupleSchema_ } from '~/index.js'
import { tuple } from '~/schema/tuple/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchemaRec } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodTupleAny = ZodTuple<[ZodTypeAny, ...ZodTypeAny[]], ZodTypeAny | null>

export type FromZodTuple<
  ZOD_SCHEMA extends ZodTupleAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodTuple<infer ELEMENT_ZOD_SCHEMAS>
    ? ROOT extends true
      ? TupleSchema_<FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
      : TupleSchema<FromZodSchemaRec<ELEMENT_ZOD_SCHEMAS, false>, PROPS>
    : never

export const fromZodTuple = (zodTuple: ZodTupleAny): TupleSchema =>
  tuple(...zodTuple.items.map(item => fromZodSchema(item)))
