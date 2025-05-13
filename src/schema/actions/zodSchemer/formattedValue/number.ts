import { z } from 'zod'

import type { NumberSchema, ResolvedNumberSchema } from '~/schema/index.js'
import type { Cast } from '~/types/cast.js'

import type { AddOptional, ZodLiteralMap } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedNumberZodSchema<SCHEMA extends NumberSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { enum: [ResolvedNumberSchema] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [ResolvedNumberSchema, ...ResolvedNumberSchema[]] }
      ? z.ZodUnion<Cast<ZodLiteralMap<SCHEMA['props']['enum']>, [z.ZodTypeAny, ...z.ZodTypeAny[]]>>
      : z.ZodNumber
>

export const getFormattedNumberZodSchema = (schema: NumberSchema): z.ZodTypeAny => {
  let zodSchema: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    const [enumTailHead, ...enumTailTail] = enumTail

    zodSchema =
      enumTailHead !== undefined
        ? z.union([
            z.literal(enumHead),
            z.literal(enumTailHead),
            ...enumTailTail.map(val => z.literal(val))
          ])
        : z.literal(enumHead)
  } else {
    zodSchema = z.number()
  }

  return addOptional(schema, zodSchema)
}
