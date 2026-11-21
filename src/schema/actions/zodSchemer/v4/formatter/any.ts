import { z } from 'zod/v4'

import type { AnySchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
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
  WithOptional<SCHEMA, OPTIONS, z.ZodCustom<SCHEMA['props']['castAs'], SCHEMA['props']['castAs']>>
>

/**
 * Build a Zod schema validating a formatted `any` value.
 */
export const anyZodFormatter = (schema: AnySchema, options: ZodFormatterOptions): z.ZodType =>
  withMeta(
    schema,
    withDecoding(schema, withOptional(schema, withValidate(schema, z.custom()), options), options)
  )
