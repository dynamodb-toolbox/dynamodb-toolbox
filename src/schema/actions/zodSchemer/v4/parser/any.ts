import { z } from 'zod/v4'

import type { AnySchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `any` value.
 */
export type AnyZodParser<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithDefault<
    SCHEMA,
    OPTIONS,
    WithOptional<SCHEMA, OPTIONS, z.ZodCustom<SCHEMA['props']['castAs'], SCHEMA['props']['castAs']>>
  >
>

/**
 * Build a Zod schema validating an input `any` value.
 */
export const anyZodParser = (schema: AnySchema, options: ZodParserOptions): z.ZodType =>
  withMeta(
    schema,
    withEncoding(
      schema,
      withDefault(schema, withOptional(schema, withValidate(schema, z.custom()), options), options),
      options
    )
  )
