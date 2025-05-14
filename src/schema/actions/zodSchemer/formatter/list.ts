import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'
import type { Overwrite } from '~/types/overwrite.js'

import type { SchemaZodFormatter } from './schema.js'
import { schemaZodFormatter } from './schema.js'
import type { ZodFormatterOptions } from './types.js'
import type { WithOptional } from './utils.js'
import { withOptional } from './utils.js'

export type ListZodFormatter<
  SCHEMA extends ListSchema,
  OPTIONS extends ZodFormatterOptions = {}
> = WithOptional<
  SCHEMA,
  OPTIONS,
  z.ZodArray<SchemaZodFormatter<SCHEMA['elements'], Overwrite<OPTIONS, { defined: true }>>>
>

export const listZodFormatter = (
  schema: ListSchema,
  options: ZodFormatterOptions = {}
): z.ZodTypeAny =>
  withOptional(
    schema,
    options,
    z.array(schemaZodFormatter(schema.elements, { ...options, defined: true }))
  )
