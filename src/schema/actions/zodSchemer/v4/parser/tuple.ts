import { z } from 'zod/v4'

import type { Schema, TupleSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
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
  ELEMENTS extends [z.ZodType, ...z.ZodType[]]
> = SCHEMA['props'] extends { strict: true }
  ? z.ZodTuple<ELEMENTS, null>
  : z.ZodPipe<
      z.ZodTuple<ELEMENTS, z.ZodUnknown>,
      z.ZodTransform<
        z.output<z.ZodTuple<ELEMENTS, null>>,
        z.output<z.ZodTuple<ELEMENTS, z.ZodUnknown>>
      >
    >

/**
 * Zod schema validating an input `tuple` value.
 */
export type TupleZodParser<
  SCHEMA extends TupleSchema,
  OPTIONS extends ZodParserOptions = {}
> = TupleSchema extends SCHEMA
  ? z.ZodType
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
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
          : z.ZodType
      >
    >

/**
 * Build a Zod schema validating an input `tuple` value.
 */
export const tupleZodParser = (schema: TupleSchema, options: ZodParserOptions = {}): z.ZodType => {
  const zodTuple = z.tuple(
    schema.elements.map(element => schemaZodParser(element, { ...options, defined: true })) as [
      z.ZodType,
      ...z.ZodType[]
    ]
  )

  // Extra values are accepted but dropped, as DynamoDB-Toolbox does on a non-strict tuple
  const zodParser = schema.props.strict
    ? zodTuple
    : zodTuple.rest(z.unknown()).transform(values => values.slice(0, schema.elements.length))

  return withMeta(
    schema,
    withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options)
  )
}
