import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { WithValidate } from '../utils.js'
import { withValidate } from '../utils.js'
import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type ListZodFormatter<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodTypeAny
  : WithOptional<
      SCHEMA,
      OPTIONS,
      WithValidate<
        SCHEMA,
        z.ZodArray<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
      >
    >

export const listZodFormatter = (
  schema: ListSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    withValidate(
      schema,
      z.array(schemaZodFormatter(schema.elements, { ...options, defined: true }))
    )
  )
