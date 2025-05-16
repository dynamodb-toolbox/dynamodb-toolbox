import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { ZodParserOptions } from './types.js'
import type { WithEncoding, WithOptional } from './utils.js'
import { withEncoding, withOptional } from './utils.js'

export type BinaryZodParser<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodType<Uint8Array>>>

export const binaryZodParser = (
  schema: BinarySchema,
  options: ZodParserOptions = {}
): z.ZodTypeAny =>
  withEncoding(schema, options, withOptional(schema, options, z.instanceof(Uint8Array)))
