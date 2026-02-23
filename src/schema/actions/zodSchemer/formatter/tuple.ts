import { z } from 'zod'

import type { Schema, TupleSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { SchemaZodFormatterRec, WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type TupleZodFormatter<
  SCHEMA extends TupleSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = TupleSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      WithValidate<
        SCHEMA,
        SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
          ? SCHEMAS_HEAD extends Schema
            ? SCHEMAS_TAIL extends Schema[]
              ? z.ZodTuple<
                  [
                    SchemaZodFormatter<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: false }>>,
                    ...SchemaZodFormatterRec<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: false }>>
                  ]
                >
              : never
            : never
          : z.ZodTypeAny
      >
    >

export const tupleZodFormatter = (
  schema: TupleSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    withValidate(
      schema,
      z.tuple(
        schema.elements.map(element =>
          schemaZodFormatter(element, { ...options, defined: false })
        ) as [z.ZodTypeAny, ...z.ZodTypeAny[]]
      )
    )
  )
