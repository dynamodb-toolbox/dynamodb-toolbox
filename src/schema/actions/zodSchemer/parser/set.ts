import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodParser } from './schema.js'
import { schemaZodParser } from './schema.js'
import type { ZodParserOptions } from './types.js'
import type { WithDefault, WithOptional } from './utils.js'
import { withDefault, withOptional } from './utils.js'

export type SetZodParser<
  SCHEMA extends SetSchema,
  OPTIONS extends ZodParserOptions = {}
> = SetSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithDefault<
      SCHEMA,
      OPTIONS,
      WithOptional<
        SCHEMA,
        OPTIONS,
        z.ZodSet<SchemaZodParser<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

export const getSetZodParser = (schema: SetSchema, options: ZodParserOptions = {}): z.ZodTypeAny =>
  withDefault(
    schema,
    options,
    withOptional(
      schema,
      options,
      z.set(schemaZodParser(schema.elements, { ...options, defined: true }))
    )
  )
