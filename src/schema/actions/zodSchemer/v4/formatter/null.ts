import { z } from 'zod/v4'

import type { NullSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `null` value.
 */
export type NullZodFormatter<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodNull>>

/**
 * Build a Zod schema validating a formatted `null` value.
 */
export const nullZodFormatter = (
  schema: NullSchema,
  options: ZodFormatterOptions = {}
): z.ZodType =>
  withMeta(
    schema,
    withDecoding(schema, withOptional(schema, withValidate(schema, z.null()), options), options)
  )
