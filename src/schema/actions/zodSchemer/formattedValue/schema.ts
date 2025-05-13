import type { z } from 'zod'

import type {
  AnyOfSchema,
  AnySchema,
  BinarySchema,
  BooleanSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  RecordSchema,
  Schema,
  SetSchema,
  StringSchema
} from '~/schema/index.js'

import { getFormattedAnyZodSchema } from './any.js'
import type { FormattedAnyZodSchema } from './any.js'
import { getFormattedAnyOfZodSchema } from './anyOf.js'
import type { FormattedAnyOfZodSchema } from './anyOf.js'
import { getFormattedBinaryZodSchema } from './binary.js'
import type { FormattedBinaryZodSchema } from './binary.js'
import { getFormattedBooleanZodSchema } from './boolean.js'
import type { FormattedBooleanZodSchema } from './boolean.js'
import { getFormattedItemZodSchema } from './item.js'
import type { FormattedItemZodSchema } from './item.js'
import type { FormattedListZodSchema } from './list.js'
import { getFormattedListZodSchema } from './list.js'
import type { FormattedMapZodSchema } from './map.js'
import { getFormattedMapZodSchema } from './map.js'
import { getFormattedNullZodSchema } from './null.js'
import type { FormattedNullZodSchema } from './null.js'
import { getFormattedNumberZodSchema } from './number.js'
import type { FormattedNumberZodSchema } from './number.js'
import { getFormattedRecordZodSchema } from './record.js'
import type { FormattedRecordZodSchema } from './record.js'
import { getFormattedSetZodSchema } from './set.js'
import type { FormattedSetZodSchema } from './set.js'
import { getFormattedStringZodSchema } from './string.js'
import type { FormattedStringZodSchema } from './string.js'

export type FormattedValueZodSchema<SCHEMA extends Schema> = Schema extends SCHEMA
  ? z.ZodTypeAny
  :
      | (SCHEMA extends AnySchema ? FormattedAnyZodSchema<SCHEMA> : never)
      | (SCHEMA extends NullSchema ? FormattedNullZodSchema<SCHEMA> : never)
      | (SCHEMA extends BooleanSchema ? FormattedBooleanZodSchema<SCHEMA> : never)
      | (SCHEMA extends NumberSchema ? FormattedNumberZodSchema<SCHEMA> : never)
      | (SCHEMA extends StringSchema ? FormattedStringZodSchema<SCHEMA> : never)
      | (SCHEMA extends BinarySchema ? FormattedBinaryZodSchema<SCHEMA> : never)
      | (SCHEMA extends SetSchema ? FormattedSetZodSchema<SCHEMA> : never)
      | (SCHEMA extends ListSchema ? FormattedListZodSchema<SCHEMA> : never)
      | (SCHEMA extends MapSchema ? FormattedMapZodSchema<SCHEMA> : never)
      | (SCHEMA extends RecordSchema ? FormattedRecordZodSchema<SCHEMA> : never)
      | (SCHEMA extends AnyOfSchema ? FormattedAnyOfZodSchema<SCHEMA> : never)
      | (SCHEMA extends ItemSchema ? FormattedItemZodSchema<SCHEMA> : never)

export const getFormattedValueZodSchema = <SCHEMA extends Schema>(
  schema: SCHEMA
): FormattedValueZodSchema<SCHEMA> => {
  type RESPONSE = FormattedValueZodSchema<SCHEMA>

  switch (schema.type) {
    case 'any':
      return getFormattedAnyZodSchema(schema) as RESPONSE
    case 'null':
      return getFormattedNullZodSchema(schema) as RESPONSE
    case 'boolean':
      return getFormattedBooleanZodSchema(schema) as RESPONSE
    case 'number':
      return getFormattedNumberZodSchema(schema) as RESPONSE
    case 'string':
      return getFormattedStringZodSchema(schema) as RESPONSE
    case 'binary':
      return getFormattedBinaryZodSchema(schema) as RESPONSE
    case 'set':
      return getFormattedSetZodSchema(schema) as RESPONSE
    case 'list':
      return getFormattedListZodSchema(schema) as RESPONSE
    case 'map':
      return getFormattedMapZodSchema(schema) as RESPONSE
    case 'record':
      return getFormattedRecordZodSchema(schema) as RESPONSE
    case 'anyOf':
      return getFormattedAnyOfZodSchema(schema) as RESPONSE
    case 'item':
      return getFormattedItemZodSchema(schema) as RESPONSE
  }
}
