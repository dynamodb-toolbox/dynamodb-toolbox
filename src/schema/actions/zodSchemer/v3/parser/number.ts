import { z } from 'zod/v3'

import type { NumberSchema, ResolvedNumberSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional, ZodLiteralMap } from './utils.js'
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
      WithValidate<
        SCHEMA,
        SCHEMA['props'] extends { enum: [ResolvedNumberSchema] }
          ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
          : SCHEMA['props'] extends { enum: [ResolvedNumberSchema, ...ResolvedNumberSchema[]] }
            ? // NOTE: Could be a single Literal with v4: https://v4.zod.dev/v4#multiple-values-in-zliteral
              z.ZodUnion<
                Cast<ZodLiteralMap<SCHEMA['props']['enum']>, [z.ZodTypeAny, ...z.ZodTypeAny[]]>
              >
            : SCHEMA['props'] extends { big: true }
              ? z.ZodUnion<[z.ZodNumber, z.ZodBigInt]>
              : z.ZodNumber
      >
    >
  >
>

/**
 * Build a Zod schema validating an input `number` value.
 */
export const numberZodParser = (
  schema: NumberSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  let zodParser: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    const [enumTailHead, ...enumTailTail] = enumTail

    zodParser =
      enumTailHead !== undefined
        ? z.union([
            z.literal(enumHead),
            z.literal(enumTailHead),
            ...enumTailTail.map(val => z.literal(val))
          ])
        : z.literal(enumHead)
  } else {
    const { big = false } = props
    zodParser = big ? z.union([z.number(), z.bigint()]) : z.number()
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
