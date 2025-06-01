import { z } from 'zod'

import type { AnySchema } from '~/schema/index.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithEncoding, WithOptional } from './utils.js'
import { withDefault, withEncoding, withOptional } from './utils.js'

export type AnyZodParser<
  SCHEMA extends AnySchema,
  OPTIONS extends ZodParserOptions = {}
> = WithEncoding<
  SCHEMA,
  OPTIONS,
  WithDefault<
    SCHEMA,
    OPTIONS,
    WithOptional<SCHEMA, OPTIONS, WithValidate<SCHEMA, z.ZodType<SCHEMA['props']['castAs']>>>
  >
>

export const anyZodParser = (schema: AnySchema, options: ZodParserOptions): z.ZodTypeAny =>
  withEncoding(
    schema,
    options,
    withDefault(schema, options, withOptional(schema, options, withValidate(schema, z.custom())))
  )
