import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'

import type { ZodFormatter } from './schema.js'
import { getZodFormatter } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type ListZodFormatter<SCHEMA extends ListSchema> = AddOptional<
  SCHEMA,
  z.ZodArray<ZodFormatter<SCHEMA['elements']>>
>

export const getListZodFormatter = (schema: ListSchema): z.ZodTypeAny =>
  addOptional(schema, z.array(getZodFormatter(schema.elements)))
