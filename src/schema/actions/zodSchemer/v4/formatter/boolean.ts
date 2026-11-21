import { z } from 'zod/v4'

import type { BooleanSchema, ResolvedBooleanSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `boolean` value.
 */
export type BooleanZodFormatter<
  SCHEMA extends BooleanSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
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

/**
 * Build a Zod schema validating a formatted `boolean` value.
 */
export const booleanZodFormatter = (
  schema: BooleanSchema,
  options: ZodFormatterOptions
): z.ZodType => {
  const { enum: enumValues } = schema.props

  // A zod v4 literal accepts several values, where v3 needed a union of literals
  const zodFormatter =
    enumValues === undefined || enumValues.length === 0 ? z.boolean() : z.literal(enumValues)

  return withMeta(
    schema,
    withDecoding(schema, withOptional(schema, withValidate(schema, zodFormatter), options), options)
  )
}
