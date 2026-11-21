import { z } from 'zod/v4'

import type { Schema, TupleSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { SchemaZodFormatterRec, WithOptional } from './utils.js'
import { withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `tuple` value.
 */
export type TupleZodFormatter<
  SCHEMA extends TupleSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = TupleSchema extends SCHEMA
  ? z.ZodType
  : WithOptional<
      SCHEMA,
      OPTIONS,
      SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
        ? SCHEMAS_HEAD extends Schema
          ? SCHEMAS_TAIL extends Schema[]
            ? z.ZodTuple<
                [
                  SchemaZodFormatter<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: false }>>,
                  ...SchemaZodFormatterRec<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: false }>>
                ],
                null
              >
            : never
          : never
        : z.ZodType
    >

/**
 * Build a Zod schema validating a formatted `tuple` value.
 */
export const tupleZodFormatter = (
  schema: TupleSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  const zodTuple = z.tuple(
    schema.elements.map(element => schemaZodFormatter(element, { ...options, defined: false })) as [
      z.ZodType,
      ...z.ZodType[]
    ]
  )

  return withMeta(schema, withOptional(schema, withValidate(schema, zodTuple), options))
}
