import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type AnyZodFormatter<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = OptionalWrapper<SCHEMA, OPTIONS, z.ZodType<SCHEMA['props']['castAs']>>

export const anyZodFormatter = (schema: AnySchema, options: ZodFormatterOptions): z.ZodTypeAny =>
  optionalWrapper(schema, options, z.custom())
