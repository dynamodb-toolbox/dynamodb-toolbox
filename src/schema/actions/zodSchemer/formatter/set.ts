import { z } from 'zod'

import type { SetSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type SetZodFormatter<
  SCHEMA extends SetSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = SetSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      WithValidate<
        SCHEMA,
        z.ZodSet<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

export const getSetZodFormatter = (
  schema: SetSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    withValidate(schema, z.set(schemaZodFormatter(schema.elements, { ...options, defined: true })))
  )
