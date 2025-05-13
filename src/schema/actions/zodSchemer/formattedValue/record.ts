import { z } from 'zod'

import type { RecordSchema } from '~/schema/index.js'

import type { FormattedValueZodSchema } from './schema.js'
import { getFormattedValueZodSchema } from './schema.js'
import type { AddOptional } from './utils.js'
import { addOptional } from './utils.js'

export type FormattedRecordZodSchema<SCHEMA extends RecordSchema> = AddOptional<
  SCHEMA,
  /**
   * @debt dependency "Using ZodObject until ZodStrictRecord is a thing: https://github.com/colinhacks/zod/issues/2623"
   */
  SCHEMA extends { keys: { props: { enum: string[] } }; props: { partial?: false } }
    ? z.ZodObject<
        {
          [KEY in SCHEMA['keys']['props']['enum'][number]]: FormattedValueZodSchema<
            SCHEMA['elements']
          >
        },
        'strip'
      >
    : z.ZodRecord<
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
