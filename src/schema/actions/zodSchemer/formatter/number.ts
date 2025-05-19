import { z } from 'zod'

import type { NumberSchema, ResolvedNumberSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional, ZodLiteralMap } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

export type NumberZodFormatter<
  SCHEMA extends NumberSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
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

export const numberZodFormatter = (
  schema: NumberSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    const [enumTailHead, ...enumTailTail] = enumTail

    zodFormatter =
      enumTailHead !== undefined
        ? z.union([
            z.literal(enumHead),
            z.literal(enumTailHead),
            ...enumTailTail.map(val => z.literal(val))
          ])
        : z.literal(enumHead)
  } else {
    const { big = false } = props
    zodFormatter = big ? z.union([z.number(), z.bigint()]) : z.number()
  }

  return withDecoding(
    schema,
    options,
    withOptional(schema, options, withValidate(schema, zodFormatter))
  )
}
