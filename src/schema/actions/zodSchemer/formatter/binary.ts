import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withDescribe, withValidate } from '../utils.js'
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
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodType<Uint8Array>>>
>

/**
 * Build a Zod schema validating a formatted `binary` value.
 */
export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withDescribe(
    schema,
    withDecoding(
      schema,
      options,
      withOptional(schema, options, withValidate(schema, z.instanceof(Uint8Array)))
    )
  )
