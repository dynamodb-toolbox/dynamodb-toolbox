import { z } from 'zod'

import type { ResolvedStringSchema, StringSchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

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

export const getStringZodParser = (
  schema: StringSchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny => {
  let zodFormatter: z.ZodTypeAny

  const { props } = schema
  const [enumHead, ...enumTail] = props.enum ?? []

  if (enumHead !== undefined) {
    zodFormatter = enumTail.length > 0 ? z.enum([enumHead, ...enumTail]) : z.literal(enumHead)
  } else {
    zodFormatter = z.string()
  }

  return withEncoding(
    schema,
    options,
    withDefault(schema, options, withOptional(schema, options, withValidate(schema, zodFormatter)))
  )
}
