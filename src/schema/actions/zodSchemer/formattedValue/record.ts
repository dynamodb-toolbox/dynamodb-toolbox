import { z } from 'zod'

import type { RecordSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'

export type FormattedRecordZodSchema<SCHEMA extends RecordSchema> = z.ZodRecord<
  FormattedValueZodSchema<SCHEMA['keys']> extends z.KeySchema
    ? FormattedValueZodSchema<SCHEMA['keys']>
    : never,
  FormattedValueZodSchema<SCHEMA['elements']>
>

export const getFormattedRecordZodSchema = (schema: RecordSchema): z.ZodTypeAny =>
  z.record(getFormattedValueZodSchema(schema.keys), getFormattedValueZodSchema(schema.elements))
