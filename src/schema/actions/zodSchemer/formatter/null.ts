import { z } from 'zod'

import type { NullSchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithTransform } from './utils.js'
import { withOptional, withTransform } from './utils.js'

export type NullZodFormatter<
  SCHEMA extends NullSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithTransform<SCHEMA, OPTIONS, WithOptional<SCHEMA, OPTIONS, z.ZodNull>>

export const nullZodFormatter = (
  schema: NullSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny => withTransform(schema, options, withOptional(schema, options, z.null()))
