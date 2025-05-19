import { z } from 'zod'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

export type AnyOfZodParser<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ZodParserOptions = {}
> = AnyOfSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        WithValidate<
          SCHEMA,
          SCHEMA['props'] extends { discriminator: string }
            ? z.ZodDiscriminatedUnion<
                SCHEMA['props']['discriminator'],
                MapAnyOfZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
              >
            : SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
              ? SCHEMAS_HEAD extends Schema
                ? SCHEMAS_TAIL extends Schema[]
                  ? z.ZodUnion<
                      [
                        SchemaZodParser<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                        ...MapAnyOfZodParser<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                      ]
                    >
                  : never
                : never
              : z.ZodTypeAny
        >
      >
    >

type MapAnyOfZodParser<
  SCHEMAS extends Schema[],
  OPTIONS extends ZodParserOptions = {},
  RESULTS extends z.ZodTypeAny[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? MapAnyOfZodParser<
          SCHEMAS_TAIL,
          OPTIONS,
          [...RESULTS, SchemaZodParser<SCHEMAS_HEAD, OPTIONS>]
        >
      : never
    : never
  : RESULTS

export const anyOfZodParser = (
  schema: AnyOfSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { discriminator } = schema.props
  if (discriminator !== undefined) {
    // LIMITATION: Does not support nested `anyOf`s for now, should change with v4: https://v4.zod.dev/v4#upgraded-zdiscriminatedunion
    // LIMITATION: Does not support `savedAs` attributes for now as ZodEffects are not valid discriminatedUnion options
    zodFormatter = z.discriminatedUnion(
      discriminator,
      schema.elements.map(element => schemaZodParser(element, { ...options, defined: true })) as [
        z.ZodDiscriminatedUnionOption<string>,
        ...z.ZodDiscriminatedUnionOption<string>[]
      ]
    )
  } else {
    zodFormatter = z.union(
      schema.elements.map(element => schemaZodParser(element, { ...options, defined: true })) as [
        z.ZodTypeAny,
        z.ZodTypeAny,
        ...z.ZodTypeAny[]
      ]
    )
  }

  return withDefault(
    schema,
    options,
    withOptional(schema, options, withValidate(schema, zodFormatter))
  )
}
