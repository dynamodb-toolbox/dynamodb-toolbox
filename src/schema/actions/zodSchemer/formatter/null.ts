import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `null` value.
 */
export type NullZodFormatter<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodNull>>>

/**
 * Build a Zod schema validating a formatted `null` value.
 */
export const nullZodFormatter = (
  schema: NullSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withDescribe(
    schema,
    withDecoding(schema, options, withOptional(schema, options, withValidate(schema, z.null())))
  )
