import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
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
  WithDefault<
    SCHEMA,
    OPTIONS,
    WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodType<Uint8Array>>>
  >
>

/**
 * Build a Zod schema validating an input `binary` value.
 */
export const binaryZodParser = (
  schema: BinarySchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny =>
  withDescribe(
    schema,
    withEncoding(
      schema,
      options,
      withDefault(
        schema,
        options,
        withOptional(schema, options, withValidate(schema, z.instanceof(Uint8Array)))
      )
    )
  )
