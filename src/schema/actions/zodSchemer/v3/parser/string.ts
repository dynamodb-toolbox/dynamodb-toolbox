import { z } from 'zod/v3'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
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
      WithValidate<
        SCHEMA,
        SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
          ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
          : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
            ? z.ZodEnum<SCHEMA['props']['enum']>
            : z.ZodString
      >
    >
  >
>

/**
 * Build a Zod schema validating an input `string` value.
 */
export const stringZodParser = (
  schema: StringSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  let zodParser: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    zodParser = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodParser = z.string()
  }

  return withDescribe(
    schema,
    withEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, zodParser), options), options),
      options
    )
  )
}
