import { z } from 'zod'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedStringZodSchema<SCHEMA extends StringSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
      ? z.ZodEnum<SCHEMA['props']['enum']>
      : z.ZodString
>

export const getFormattedStringZodSchema = (schema: StringSchema): z.ZodTypeAny => {
  let zodSchema: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    zodSchema = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodSchema = z.string()
  }

  return addOptional(schema, zodSchema)
}
