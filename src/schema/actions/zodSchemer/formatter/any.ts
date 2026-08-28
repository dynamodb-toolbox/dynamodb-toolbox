import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `any` value.
 */
export type AnyZodFormatter<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodType<SCHEMA['props']['castAs']>>>
>

/**
 * Build a Zod schema validating a formatted `any` value.
 */
export const anyZodFormatter = (schema: AnySchema, options: ZodFormatterOptions): z.ZodTypeAny =>
  withDescribe(
    schema,
    withDecoding(schema, options, withOptional(schema, options, withValidate(schema, z.custom())))
  )
