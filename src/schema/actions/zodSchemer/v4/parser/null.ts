import { z } from 'zod/v4'

import type { NullSchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `null` value.
 */
export type NullZodParser<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithDefault<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodNull>>
>

/**
 * Build a Zod schema validating an input `null` value.
 */
export const nullZodParser = (schema: NullSchema, options: ZodParserOptions = {}): z.ZodType =>
  withMeta(
    schema,
    withEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, z.null()), options), options),
      options
    )
  )
