import { z } from 'zod'

import type { StringSchema } from '~/schema/index.js'

import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedStringZodSchema<SCHEMA extends StringSchema> = AddOptional<
  SCHEMA,
  SCHEMA['props'] extends { enum: [string] }
    ? z.ZodLiteral<SCHEMA['props']['enum'][0]>
    : SCHEMA['props'] extends { enum: [string, ...string[]] }
      ? z.ZodEnum<SCHEMA['props']['enum']>
      : z.ZodString
>

export const getFormattedStringZodSchema = (schema: StringSchema): z.ZodTypeAny =>
  addOptional(schema, z.string())
