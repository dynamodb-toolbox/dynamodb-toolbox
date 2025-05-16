import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { ZodParserOptions } from './types.js'
import type { WithEncoding, WithOptional } from './utils.js'
import { withEncoding, withOptional } from './utils.js'

export type AnyZodParser<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, z.ZodType<SCHEMA['props']['castAs']>>
>

export const anyZodParser = (schema: AnySchema, options: ZodParserOptions): z.ZodTypeAny =>
  withEncoding(schema, options, withOptional(schema, options, z.custom()))
