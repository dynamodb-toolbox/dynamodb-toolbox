import { z } from 'zod'

import type { Schema, TupleSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { SchemaZodParserRec, WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

export type TupleZodParser<
  SCHEMA extends TupleSchema,
  OPTIONS extends ZodParserOptions = {}
> = TupleSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        WithValidate<
          SCHEMA,
          SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
            ? SCHEMAS_HEAD extends Schema
              ? SCHEMAS_TAIL extends Schema[]
                ? z.ZodTuple<
                    [
                      SchemaZodParser<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                      ...SchemaZodParserRec<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                    ]
                  >
                : never
              : never
            : z.ZodTypeAny
        >
      >
    >

export const tupleZodParser = (schema: TupleSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withDefault(
    schema,
    options,
    withOptional(
      schema,
      options,
      withValidate(
        schema,
        z.tuple(
          schema.elements.map(element =>
            schemaZodParser(element, { ...options, defined: true })
          ) as [z.ZodTypeAny, ...z.ZodTypeAny[]]
        )
      )
    )
  )
