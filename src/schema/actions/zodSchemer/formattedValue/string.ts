import { z } from 'zod'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type StringZodFormatter<SCHEMA extends StringSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
      ? z.ZodEnum<SCHEMA['props']['enum']>
      : z.ZodString
>

export const getStringZodFormatter = (schema: StringSchema): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    zodFormatter = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodFormatter = z.string()
  }

  return addOptional(schema, zodFormatter)
}
