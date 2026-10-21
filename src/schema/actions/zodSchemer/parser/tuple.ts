import { z } from 'zod'

import type { Schema, TupleSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { SchemaZodParserRec, WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

/**
 * Zod schema of the elements of an input `tuple` value.
 */
type TupleZodParserValue<
  SCHEMA extends TupleSchema,
  ELEMENTS extends [z.ZodTypeAny, ...z.ZodTypeAny[]]
> = SCHEMA['props'] extends { strict: true }
  ? z.ZodTuple<ELEMENTS>
  : z.ZodEffects<
      z.ZodTuple<ELEMENTS, z.ZodUnknown>,
      z.ZodTuple<ELEMENTS>['_output'],
      z.ZodTuple<ELEMENTS, z.ZodUnknown>['_input']
    >

/**
 * Zod schema validating an input `tuple` value.
 */
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
                ? TupleZodParserValue<
                    SCHEMA,
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

/**
 * Build a Zod schema validating an input `tuple` value.
 */
export const tupleZodParser = (
  schema: TupleSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  const zodTuple = z.tuple(
    schema.elements.map(element => schemaZodParser(element, { ...options, defined: true })) as [
      z.ZodTypeAny,
      ...z.ZodTypeAny[]
    ]
  )

  return withDescribe(
    schema,
    withDefault(
      schema,
      options,
      withOptional(
        schema,
        options,
        withValidate(
          schema,
          schema.props.strict
            ? zodTuple
            : zodTuple.rest(z.unknown()).transform(values => values.slice(0, zodTuple.items.length))
        )
      )
    )
  )
}
