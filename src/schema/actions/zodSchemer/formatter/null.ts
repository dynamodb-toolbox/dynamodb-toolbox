import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

export type NullZodFormatter<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodNull>>>

export const nullZodFormatter = (
  schema: NullSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withDecoding(schema, options, withOptional(schema, options, withValidate(schema, z.null())))
