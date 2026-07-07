import type { KeySchema, ZodRecord } from 'zod'
import { ZodEnum, ZodString } from 'zod'

import type { RecordSchema, RecordSchema_, StringSchema } from '~/index.js'
import { record } from '~/schema/record/index.js'
import type { SchemaProps } from '~/schema/types/schemaProps.js'

import type { FromZodSchema } from './fromZodSchema.js'
import { fromZodSchema } from './fromZodSchema.js'

export type ZodRecordAny = ZodRecord<KeySchema>

export type FromZodRecord<
  ZOD_SCHEMA extends ZodRecordAny,
  ROOT extends boolean = true,
  PROPS extends SchemaProps = {}
> =
  ZOD_SCHEMA extends ZodRecord<infer ZOD_SCHEMA_KEYS, infer ZOD_SCHEMA_VALUES>
    ? FromZodSchema<ZOD_SCHEMA_KEYS, false> extends StringSchema
      ? ROOT extends true
        ? RecordSchema_<
            FromZodSchema<ZOD_SCHEMA_KEYS, false>,
            FromZodSchema<ZOD_SCHEMA_VALUES, false>,
            PROPS
          >
        : RecordSchema<
            FromZodSchema<ZOD_SCHEMA_KEYS, false>,
            FromZodSchema<ZOD_SCHEMA_VALUES, false>,
            PROPS
          >
      : never
    : never

export const fromZodRecord = (zodRecord: ZodRecordAny): RecordSchema => {
  const { keySchema, valueSchema } = zodRecord

  if (!(keySchema instanceof ZodString || keySchema instanceof ZodEnum)) {
    throw new Error()
  }

  return record(fromZodSchema(keySchema), fromZodSchema(valueSchema))
}
