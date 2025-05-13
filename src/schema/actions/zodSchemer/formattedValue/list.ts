import { z } from 'zod'

import type { ListSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'

export type FormattedListZodSchema<SCHEMA extends ListSchema> = z.ZodArray<
  FormattedValueZodSchema<SCHEMA['elements']>
>

export const getFormattedListZodSchema = (schema: ListSchema): z.ZodTypeAny =>
  z.array(getFormattedValueZodSchema(schema.elements))
