import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { ZodParserOptions } from './types.js'
import type { WithEncoding, WithOptional } from './utils.js'
import { withEncoding, withOptional } from './utils.js'

export type NullZodParser<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodNull>>

export const nullZodParser = (schema: NullSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withEncoding(schema, options, withOptional(schema, options, z.null()))
