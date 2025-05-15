import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithDecoding, WithOptional } from './utils.js'
import { withDecoding, withOptional } from './utils.js'

export type BinaryZodFormatter<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithDecoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodType<Uint8Array>>>

export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withDecoding(schema, options, withOptional(schema, options, z.instanceof(Uint8Array)))
