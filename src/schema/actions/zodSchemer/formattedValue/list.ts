import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedListZodSchema<SCHEMA extends ListSchema> = AddOptional<
  SCHEMA,
  z.ZodArray<FormattedValueZodSchema<SCHEMA['elements']>>
>

export const getFormattedListZodSchema = (schema: ListSchema): z.ZodTypeAny =>
  addOptional(schema, z.array(getFormattedValueZodSchema(schema.elements)))
