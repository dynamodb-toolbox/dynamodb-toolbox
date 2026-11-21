import { z } from 'zod/v4'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import { withMeta, withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

/**
 * Zod schema validating a formatted `list` value.
 */
export type ListZodFormatter<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodType
  : WithOptional<
      SCHEMA,
      OPTIONS,
      z.ZodArray<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
    >

/**
 * Build a Zod schema validating a formatted `list` value.
 */
export const listZodFormatter = (
  schema: ListSchema,
  options: ZodFormatterOptions = {}
): z.ZodType =>
  withMeta(
    schema,
    withOptional(
      schema,
      withValidate(
        schema,
        z.array(schemaZodFormatter(schema.elements, { ...options, defined: true }))
      ),
      options
    )
  )
