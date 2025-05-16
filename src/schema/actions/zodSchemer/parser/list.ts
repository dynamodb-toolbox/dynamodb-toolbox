import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

export type ListZodParser<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodParserOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        z.ZodArray<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

export const listZodParser = (schema: ListSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withDefault(
    schema,
    options,
    withOptional(
      schema,
      options,
      z.array(schemaZodParser(schema.elements, { ...options, defined: true }))
    )
  )
