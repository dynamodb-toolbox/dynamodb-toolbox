import { z } from 'zod/v4'

import type { BinarySchema } from '~/schema/index.js'

import { withMeta, withValidate } from '../utils.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

// LIMITATION: Binary enums are not supported
/**
 * Zod schema validating a formatted `binary` value.
 */
export type BinaryZodFormatter<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodInstanceOf<Uint8Array>>>

/**
 * Build a Zod schema validating a formatted `binary` value.
 */
export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions = {}
): z.ZodType =>
  withMeta(
    schema,
    withDecoding(
      schema,
      withOptional(schema, withValidate(schema, z.instanceof(Uint8Array)), options),
      options
    )
  )
