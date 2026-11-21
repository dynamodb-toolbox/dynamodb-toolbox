import { z } from 'zod/v4'

import type { BooleanSchema, ResolvedBooleanSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `boolean` value.
 */
export type BooleanZodParser<
  SCHEMA extends BooleanSchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithDefault<
    SCHEMA,
    OPTIONS,
    WithOptional<
      SCHEMA,
      OPTIONS,
      SCHEMA['props'] extends { enum: [ResolvedBooleanSchema, ...ResolvedBooleanSchema[]] }
        ? z.ZodLiteral<SCHEMA['props']['enum'][number]>
        : z.ZodBoolean
    >
  >
>

/**
 * Build a Zod schema validating an input `boolean` value.
 */
export const booleanZodParser = (schema: BooleanSchema, options: ZodParserOptions): z.ZodType => {
  const { enum: enumValues } = schema.props

  // A zod v4 literal accepts several values, where v3 needed a union of literals
  const zodParser =
    enumValues === undefined || enumValues.length === 0 ? z.boolean() : z.literal(enumValues)

  return withMeta(
    schema,
    withEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options),
      options
    )
  )
}
