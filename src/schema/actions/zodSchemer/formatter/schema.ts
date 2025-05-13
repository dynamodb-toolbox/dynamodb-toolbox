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

import type { AnyZodFormatter } from './any.js'
import { anyZodFormatter } from './any.js'
import type { AnyOfZodFormatter } from './anyOf.js'
import { anyOfZodFormatter } from './anyOf.js'
import type { BinaryZodFormatter } from './binary.js'
import { binaryZodFormatter } from './binary.js'
import type { BooleanZodFormatter } from './boolean.js'
import { booleanZodFormatter } from './boolean.js'
import type { ItemZodFormatter } from './item.js'
import { itemZodFormatter } from './item.js'
import type { ListZodFormatter } from './list.js'
import { listZodFormatter } from './list.js'
import type { MapZodFormatter } from './map.js'
import { mapZodFormatter } from './map.js'
import type { NullZodFormatter } from './null.js'
import { nullZodFormatter } from './null.js'
import type { NumberZodFormatter } from './number.js'
import { numberZodFormatter } from './number.js'
import type { RecordZodFormatter } from './record.js'
import { recordZodFormatter } from './record.js'
import type { SetZodFormatter } from './set.js'
import { getSetZodFormatter } from './set.js'
import type { StringZodFormatter } from './string.js'
import { getStringZodFormatter } from './string.js'
import type { ZodFormatterOptions } from './types.js'

export type ZodFormatter<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemZodFormatter<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? SchemaZodFormatter<SCHEMA, OPTIONS>
    : never

export type SchemaZodFormatter<
  SCHEMA extends Schema,
  OPTIONS extends ZodFormatterOptions = {}
> = Schema extends SCHEMA
  ? z.ZodTypeAny
  :
      | (SCHEMA extends AnySchema ? AnyZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends NullSchema ? NullZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends BooleanSchema ? BooleanZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends NumberSchema ? NumberZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends StringSchema ? StringZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends BinarySchema ? BinaryZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends SetSchema ? SetZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordZodFormatter<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfZodFormatter<SCHEMA, OPTIONS> : never)

export const schemaZodFormatter = <SCHEMA extends Schema, OPTIONS extends ZodFormatterOptions = {}>(
  schema: SCHEMA,
  options: OPTIONS = {} as OPTIONS
): SchemaZodFormatter<SCHEMA, OPTIONS> => {
  type ZOD_FORMATTER = SchemaZodFormatter<SCHEMA, OPTIONS>

  switch (schema.type) {
    case 'any':
      return anyZodFormatter(schema, options) as ZOD_FORMATTER
    case 'null':
      return nullZodFormatter(schema, options) as ZOD_FORMATTER
    case 'boolean':
      return booleanZodFormatter(schema, options) as ZOD_FORMATTER
    case 'number':
      return numberZodFormatter(schema, options) as ZOD_FORMATTER
    case 'string':
      return getStringZodFormatter(schema, options) as ZOD_FORMATTER
    case 'binary':
      return binaryZodFormatter(schema, options) as ZOD_FORMATTER
    case 'set':
      return getSetZodFormatter(schema, options) as ZOD_FORMATTER
    case 'list':
      return listZodFormatter(schema, options) as ZOD_FORMATTER
    case 'map':
      return mapZodFormatter(schema, options) as ZOD_FORMATTER
    case 'record':
      return recordZodFormatter(schema, options) as ZOD_FORMATTER
    case 'anyOf':
      return anyOfZodFormatter(schema, options) as ZOD_FORMATTER
    case 'item':
      // NOTE: Should not happen
      return itemZodFormatter(schema, options) as unknown as ZOD_FORMATTER
  }
}
