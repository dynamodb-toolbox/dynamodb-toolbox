import { z } from 'zod'

import type { BinarySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithTransform } from './utils.js'
import { withOptional, withTransform } from './utils.js'

export type BinaryZodFormatter<
  SCHEMA extends BinarySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithTransform<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodType<Uint8Array>>>

export const binaryZodFormatter = (
  schema: BinarySchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withTransform(schema, options, withOptional(schema, options, z.instanceof(Uint8Array)))
