import { z } from 'zod/v4'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `string` value.
 */
export type StringZodParser<
  SCHEMA extends StringSchema,
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
      SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
        ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
        : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
          ? // A zod v4 enum is keyed by its values, where v3 held them as a tuple
            z.ZodEnum<z.util.ToEnum<SCHEMA['props']['enum'][number]>>
          : z.ZodString
    >
  >
>

/**
 * Build a Zod schema validating an input `string` value.
 */
export const stringZodParser = (
  schema: StringSchema,
  options: ZodParserOptions = {}
): z.ZodType => {
  let zodParser: z.ZodType

  const [enumHead, ...enumTail] = schema.props.enum ?? []

  if (enumHead !== undefined) {
    zodParser = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodParser = z.string()
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
