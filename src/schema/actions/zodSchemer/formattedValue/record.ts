import { z } from 'zod'

import type { RecordSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedRecordZodSchema<SCHEMA extends RecordSchema> = AddOptional<
  SCHEMA,
  z.ZodRecord<
    FormattedValueZodSchema<SCHEMA['keys']> extends z.KeySchema
      ? FormattedValueZodSchema<SCHEMA['keys']>
      : never,
    FormattedValueZodSchema<SCHEMA['elements']>
  >
>

export const getFormattedRecordZodSchema = (schema: RecordSchema): z.ZodTypeAny =>
  addOptional(
    schema,
    z.record(getFormattedValueZodSchema(schema.keys), getFormattedValueZodSchema(schema.elements))
  )
