import { z } from 'zod/v4'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

/**
 * Zod schema validating an input `list` value.
 */
export type ListZodParser<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodParserOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodType
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        z.ZodArray<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

/**
 * Build a Zod schema validating an input `list` value.
 */
export const listZodParser = (schema: ListSchema, options: ZodParserOptions = {}): z.ZodType =>
  withMeta(
    schema,
    withDefault(
      schema,
      withOptional(
        schema,
        withValidate(
          schema,
          z.array(schemaZodParser(schema.elements, { ...options, defined: true }))
        ),
        options
      ),
      options
    )
  )
