import { z } from 'zod/v4'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `string` value.
 */
export type StringZodFormatter<
  SCHEMA extends StringSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<
    SCHEMA,
    OPTIONS,
    SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
      ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
      : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
        ? // A zod v4 enum is keyed by its values, where v3 held them as a tuple
          z.ZodEnum<z.util.ToEnum<SCHEMA['props']['enum'][number]>>
        : z.ZodString
  >
>

/**
 * Build a Zod schema validating a formatted `string` value.
 */
export const stringZodFormatter = (
  schema: StringSchema,
  options: ZodFormatterOptions = {}
): z.ZodType => {
  let zodFormatter: z.ZodType

  const [enumHead, ...enumTail] = schema.props.enum ?? []

  if (enumHead !== undefined) {
    zodFormatter = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodFormatter = z.string()
  }

  return withMeta(
    schema,
    withDecoding(schema, withOptional(schema, withValidate(schema, zodFormatter), options), options)
  )
}
