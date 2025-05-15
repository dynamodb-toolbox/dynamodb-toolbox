import { z } from 'zod'

import type { BooleanSchema, ResolvedBooleanSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional, ZodLiteralMap } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

export type BooleanZodFormatter<
  SCHEMA extends BooleanSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<
    SCHEMA,
    OPTIONS,
    SCHEMA['props'] extends { enum: [ResolvedBooleanSchema] }
      ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
      : SCHEMA['props'] extends { enum: [ResolvedBooleanSchema, ...ResolvedBooleanSchema[]] }
        ? // NOTE: Could be a single Literal with v4: https://v4.zod.dev/v4#multiple-values-in-zliteral
          z.ZodUnion<
            Cast<ZodLiteralMap<SCHEMA['props']['enum']>, [z.ZodTypeAny, ...z.ZodTypeAny[]]>
          >
        : z.ZodBoolean
  >
>

export const booleanZodFormatter = (
  schema: BooleanSchema,
  options: ZodFormatterOptions
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
    zodFormatter = z.boolean()
  }

  return withDecoding(schema, options, withOptional(schema, options, zodFormatter))
}
