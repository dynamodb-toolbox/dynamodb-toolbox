import { z } from 'zod/v4'

import type { SetSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `set` value.
 */
export type SetZodFormatter<
  SCHEMA extends SetSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = SetSchema extends SCHEMA
  ? z.ZodType
  : WithOptional<
      SCHEMA,
      OPTIONS,
      z.ZodSet<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
    >

/**
 * Build a Zod schema validating a formatted `set` value.
 */
export const setZodFormatter = (schema: SetSchema, options: ZodFormatterOptions = {}): z.ZodType =>
  withMeta(
    schema,
    withOptional(
      schema,
      withValidate(
        schema,
        z.set(schemaZodFormatter(schema.elements, { ...options, defined: true }))
      ),
      options
    )
  )
