import { z } from 'zod'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithTransform } from './utils.js'
import { withOptional, withTransform } from './utils.js'

export type StringZodFormatter<
  SCHEMA extends StringSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithTransform<
  SCHEMA,
  OPTIONS,
  WithOptional<
    SCHEMA,
    OPTIONS,
    SCHEMA['props'] extends { enum: [ResolvedStringSchema] }
      ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
      : SCHEMA['props'] extends { enum: [ResolvedStringSchema, ...ResolvedStringSchema[]] }
        ? z.ZodEnum<SCHEMA['props']['enum']>
        : z.ZodString
  >
>

export const getStringZodFormatter = (
  schema: StringSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    zodFormatter = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodFormatter = z.string()
  }

  return withTransform(schema, options, withOptional(schema, options, zodFormatter))
}
