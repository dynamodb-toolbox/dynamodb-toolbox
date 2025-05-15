import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { ZodFormatterOptions } from './types.js'
import type { WithOptional, WithTransform } from './utils.js'
import { withOptional, withTransform } from './utils.js'

export type AnyZodFormatter<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithTransform<
  SCHEMA,
  OPTIONS,
  WithOptional<SCHEMA, OPTIONS, z.ZodType<SCHEMA['props']['castAs']>>
>

export const anyZodFormatter = (schema: AnySchema, options: ZodFormatterOptions): z.ZodTypeAny =>
  withTransform(schema, options, withOptional(schema, options, z.custom()))
