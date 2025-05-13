import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type BinaryZodFormatter<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodFormatterOptions
> = OptionalWrapper<SCHEMA, OPTIONS, z.ZodType<Uint8Array>>

export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions
): z.ZodTypeAny => optionalWrapper(schema, options, z.instanceof(Uint8Array))
