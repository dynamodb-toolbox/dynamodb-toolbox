import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional, WithValidate } from './utils.js'
import { withDecoding, withOptional, withValidate } from './utils.js'

// LIMITATION: Binary enums are not supported
export type BinaryZodFormatter<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodType<Uint8Array>>>
>

export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withDecoding(
    schema,
    options,
    withOptional(schema, options, withValidate(schema, z.instanceof(Uint8Array)))
  )
