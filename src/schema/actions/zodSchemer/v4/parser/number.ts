import { z } from 'zod/v4'

import type { NumberSchema, ResolvedNumberSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `number` value.
 */
export type NumberZodParser<
  SCHEMA extends NumberSchema,
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
      SCHEMA['props'] extends { enum: [ResolvedNumberSchema, ...ResolvedNumberSchema[]] }
        ? z.ZodLiteral<SCHEMA['props']['enum'][number]>
        : SCHEMA['props'] extends { big: true }
          ? z.ZodUnion<readonly [z.ZodNumber, z.ZodBigInt]>
          : z.ZodNumber
    >
  >
>

/**
 * Build a Zod schema validating an input `number` value.
 */
export const numberZodParser = (
  schema: NumberSchema,
  options: ZodParserOptions = {}
): z.ZodType => {
  let zodParser: z.ZodType

  const { enum: enumValues, big = false } = schema.props

  if (enumValues !== undefined && enumValues.length > 0) {
    // A zod v4 literal accepts several values, where v3 needed a union of literals
    zodParser = z.literal(enumValues)
  } else if (big) {
    zodParser = z.union([z.number(), z.bigint()])
  } else {
    zodParser = z.number()
  }

  return withMeta(
    schema,
    withEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options),
      options
    )
  )
}
