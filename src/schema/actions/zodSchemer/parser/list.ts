import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type ListZodParser<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodParserOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      z.ZodArray<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
    >

export const listZodParser = (schema: ListSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    z.array(schemaZodParser(schema.elements, { ...options, defined: true }))
  )
