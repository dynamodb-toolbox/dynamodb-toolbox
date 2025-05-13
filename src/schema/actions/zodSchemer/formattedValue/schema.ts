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

import { getAnyZodFormatter } from './any.js'
import type { AnyZodFormatter } from './any.js'
import { getAnyOfZodFormatter } from './anyOf.js'
import type { AnyOfZodFormatter } from './anyOf.js'
import { getBinaryZodFormatter } from './binary.js'
import type { BinaryZodFormatter } from './binary.js'
import { getBooleanZodFormatter } from './boolean.js'
import type { BooleanZodFormatter } from './boolean.js'
import { getItemZodFormatter } from './item.js'
import type { ItemZodFormatter } from './item.js'
import type { ListZodFormatter } from './list.js'
import { getListZodFormatter } from './list.js'
import type { MapZodFormatter } from './map.js'
import { getMapZodFormatter } from './map.js'
import { getNullZodFormatter } from './null.js'
import type { NullZodFormatter } from './null.js'
import { getNumberZodFormatter } from './number.js'
import type { NumberZodFormatter } from './number.js'
import { getRecordZodFormatter } from './record.js'
import type { RecordZodFormatter } from './record.js'
import { getSetZodFormatter } from './set.js'
import type { SetZodFormatter } from './set.js'
import { getStringZodFormatter } from './string.js'
import type { StringZodFormatter } from './string.js'

export type ZodFormatter<SCHEMA extends Schema> = Schema extends SCHEMA
  ? z.ZodTypeAny
  :
      | (SCHEMA extends AnySchema ? AnyZodFormatter<SCHEMA> : never)
      | (SCHEMA extends NullSchema ? NullZodFormatter<SCHEMA> : never)
      | (SCHEMA extends BooleanSchema ? BooleanZodFormatter<SCHEMA> : never)
      | (SCHEMA extends NumberSchema ? NumberZodFormatter<SCHEMA> : never)
      | (SCHEMA extends StringSchema ? StringZodFormatter<SCHEMA> : never)
      | (SCHEMA extends BinarySchema ? BinaryZodFormatter<SCHEMA> : never)
      | (SCHEMA extends SetSchema ? SetZodFormatter<SCHEMA> : never)
      | (SCHEMA extends ListSchema ? ListZodFormatter<SCHEMA> : never)
      | (SCHEMA extends MapSchema ? MapZodFormatter<SCHEMA> : never)
      | (SCHEMA extends RecordSchema ? RecordZodFormatter<SCHEMA> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfZodFormatter<SCHEMA> : never)
      | (SCHEMA extends ItemSchema ? ItemZodFormatter<SCHEMA> : never)

export const getZodFormatter = <SCHEMA extends Schema>(schema: SCHEMA): ZodFormatter<SCHEMA> => {
  type RESPONSE = ZodFormatter<SCHEMA>

  switch (schema.type) {
    case 'any':
      return getAnyZodFormatter(schema) as RESPONSE
    case 'null':
      return getNullZodFormatter(schema) as RESPONSE
    case 'boolean':
      return getBooleanZodFormatter(schema) as RESPONSE
    case 'number':
      return getNumberZodFormatter(schema) as RESPONSE
    case 'string':
      return getStringZodFormatter(schema) as RESPONSE
    case 'binary':
      return getBinaryZodFormatter(schema) as RESPONSE
    case 'set':
      return getSetZodFormatter(schema) as RESPONSE
    case 'list':
      return getListZodFormatter(schema) as RESPONSE
    case 'map':
      return getMapZodFormatter(schema) as RESPONSE
    case 'record':
      return getRecordZodFormatter(schema) as RESPONSE
    case 'anyOf':
      return getAnyOfZodFormatter(schema) as RESPONSE
    case 'item':
      return getItemZodFormatter(schema) as RESPONSE
  }
}
