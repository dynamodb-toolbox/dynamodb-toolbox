import { z } from 'zod/v4'

import type { SetSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

/**
 * Zod schema validating an input `set` value.
 */
export type SetZodParser<
  SCHEMA extends SetSchema,
  OPTIONS extends ZodParserOptions = {}
> = SetSchema extends SCHEMA
  ? z.ZodType
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        z.ZodSet<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

/**
 * Build a Zod schema validating an input `set` value.
 */
export const setZodParser = (schema: SetSchema, options: ZodParserOptions = {}): z.ZodType =>
  withMeta(
    schema,
    withDefault(
      schema,
      withOptional(
        schema,
        withValidate(
          schema,
          z.set(schemaZodParser(schema.elements, { ...options, defined: true }))
        ),
        options
      ),
      options
    )
  )
