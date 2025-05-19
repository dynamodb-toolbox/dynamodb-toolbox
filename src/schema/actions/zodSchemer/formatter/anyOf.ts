import { z } from 'zod'

import type { AnyOfSchema, Schema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithValidate } from './utils.js'
import { withOptional, withValidate } from './utils.js'

export type AnyOfZodFormatter<
  SCHEMA extends AnyOfSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = AnyOfSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      WithValidate<
        SCHEMA,
        SCHEMA['props'] extends { discriminator: string }
          ? z.ZodDiscriminatedUnion<
              SCHEMA['props']['discriminator'],
              MapAnyOfZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>
            >
          : SCHEMA['elements'] extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
            ? SCHEMAS_HEAD extends Schema
              ? SCHEMAS_TAIL extends Schema[]
                ? z.ZodUnion<
                    [
                      SchemaZodFormatter<SCHEMAS_HEAD, Overwrite<OPTIONS, { defined: true }>>,
                      ...MapAnyOfZodFormatter<SCHEMAS_TAIL, Overwrite<OPTIONS, { defined: true }>>
                    ]
                  >
                : never
              : never
            : z.ZodTypeAny
      >
    >

type MapAnyOfZodFormatter<
  SCHEMAS extends Schema[],
  OPTIONS extends ZodFormatterOptions = {},
  RESULTS extends z.ZodTypeAny[] = []
> = SCHEMAS extends [infer SCHEMAS_HEAD, ...infer SCHEMAS_TAIL]
  ? SCHEMAS_HEAD extends Schema
    ? SCHEMAS_TAIL extends Schema[]
      ? MapAnyOfZodFormatter<
          SCHEMAS_TAIL,
          OPTIONS,
          [...RESULTS, SchemaZodFormatter<SCHEMAS_HEAD, OPTIONS>]
        >
      : never
    : never
  : RESULTS

export const anyOfZodFormatter = (
  schema: AnyOfSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { discriminator } = schema.props
  if (discriminator !== undefined) {
    // LIMITATION: Does not support nested `anyOf`s for now, should change with v4: https://v4.zod.dev/v4#upgraded-zdiscriminatedunion
    // LIMITATION: Does not support `savedAs` attributes for now as ZodEffects are not valid discriminatedUnion options
    zodFormatter = z.discriminatedUnion(
      discriminator,
      schema.elements.map(element =>
        schemaZodFormatter(element, { ...options, defined: true })
      ) as [z.ZodDiscriminatedUnionOption<string>, ...z.ZodDiscriminatedUnionOption<string>[]]
    )
  } else {
    zodFormatter = z.union(
      schema.elements.map(element =>
        schemaZodFormatter(element, { ...options, defined: true })
      ) as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]
    )
  }

  return withOptional(schema, options, withValidate(schema, zodFormatter))
}
