import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type NullZodFormatter<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodFormatterOptions
> = OptionalWrapper<SCHEMA, OPTIONS, z.ZodNull>

export const nullZodFormatter = (schema: NullSchema, options: ZodFormatterOptions): z.ZodTypeAny =>
  optionalWrapper(schema, options, z.null())
