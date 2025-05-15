import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type SetZodParser<
  SCHEMA extends SetSchema,
  OPTIONS extends ZodParserOptions = {}
> = SetSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      z.ZodSet<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
    >

export const getSetZodParser = (schema: SetSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    z.set(schemaZodParser(schema.elements, { ...options, defined: true }))
  )
