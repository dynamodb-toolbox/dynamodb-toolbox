import { z } from 'zod/v4'

import type { NumberSchema, ResolvedNumberSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `number` value.
 */
export type NumberZodFormatter<
  SCHEMA extends NumberSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
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

/**
 * Build a Zod schema validating a formatted `number` value.
 */
export const numberZodFormatter = (
  schema: NumberSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  let zodFormatter: z.ZodType

  const { enum: enumValues, big = false } = schema.props

  if (enumValues !== undefined && enumValues.length > 0) {
    // A zod v4 literal accepts several values, where v3 needed a union of literals
    zodFormatter = z.literal(enumValues)
  } else if (big) {
    zodFormatter = z.union([z.number(), z.bigint()])
  } else {
    zodFormatter = z.number()
  }

  return withMeta(
    schema,
    withDecoding(schema, withOptional(schema, withValidate(schema, zodFormatter), options), options)
  )
}
