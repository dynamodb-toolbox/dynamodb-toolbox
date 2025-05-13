import { z } from 'zod'

import type { BooleanSchema, ResolvedBooleanSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper, ZodLiteralMap } from './utils.js'
import { optionalWrapper } from './utils.js'

export type BooleanZodFormatter<
  SCHEMA extends BooleanSchema,
  OPTIONS extends ZodFormatterOptions
> = OptionalWrapper<
  SCHEMA,
  OPTIONS,
  SCHEMA['props'] extends { enum: [ResolvedBooleanSchema] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [ResolvedBooleanSchema, ...ResolvedBooleanSchema[]] }
      ? z.ZodUnion<Cast<ZodLiteralMap<SCHEMA['props']['enum']>, [z.ZodTypeAny, ...z.ZodTypeAny[]]>>
      : z.ZodBoolean
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

  return optionalWrapper(schema, options, zodFormatter)
}
