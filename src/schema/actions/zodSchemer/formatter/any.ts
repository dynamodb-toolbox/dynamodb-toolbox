import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

export type AnyZodFormatter<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, z.ZodType<SCHEMA['props']['castAs']>>
>

export const anyZodFormatter = (schema: AnySchema, options: ZodFormatterOptions): z.ZodTypeAny =>
  withDecoding(schema, options, withOptional(schema, options, z.custom()))
