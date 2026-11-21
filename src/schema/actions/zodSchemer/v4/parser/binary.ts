import { z } from 'zod/v4'

import type { BinarySchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

/**
 * Zod schema validating an input `binary` value.
 */
export type BinaryZodParser<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithDefault<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodInstanceOf<Uint8Array>>>
>

/**
 * Build a Zod schema validating an input `binary` value.
 */
export const binaryZodParser = (schema: BinarySchema, options: ZodParserOptions = {}): z.ZodType =>
  withMeta(
    schema,
    withEncoding(
      schema,
      withDefault(
        schema,
        withOptional(schema, withValidate(schema, z.instanceof(Uint8Array)), options),
        options
      ),
      options
    )
  )
