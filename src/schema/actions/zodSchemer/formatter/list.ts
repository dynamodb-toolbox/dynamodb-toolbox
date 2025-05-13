import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { OptionalWrapper } from './utils.js'
import { optionalWrapper } from './utils.js'

export type ListZodFormatter<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = ListSchema extends SCHEMA
  ? z.ZodTypeAny
  : OptionalWrapper<
      SCHEMA,
      OPTIONS,
      z.ZodArray<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
    >

export const listZodFormatter = (
  schema: ListSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  optionalWrapper(
    schema,
    options,
    z.array(schemaZodFormatter(schema.elements, { ...options, defined: true }))
  )
