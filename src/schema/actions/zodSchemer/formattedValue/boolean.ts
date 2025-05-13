import { z } from 'zod'

import type { BooleanSchema, ResolvedBooleanSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { AddOptional, ZodLiteralMap } from './utils.js'
import { addOptional } from './utils.js'

export type BooleanZodFormatter<SCHEMA extends BooleanSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { enum: [ResolvedBooleanSchema] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [ResolvedBooleanSchema, ...ResolvedBooleanSchema[]] }
      ? z.ZodUnion<Cast<ZodLiteralMap<SCHEMA['props']['enum']>, [z.ZodTypeAny, ...z.ZodTypeAny[]]>>
      : z.ZodBoolean
>

export const getBooleanZodFormatter = (schema: BooleanSchema): z.ZodTypeAny => {
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

  return addOptional(schema, zodFormatter)
}
