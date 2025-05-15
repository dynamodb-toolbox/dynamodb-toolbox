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

import type { AnyZodParser } from './any.js'
import { anyZodParser } from './any.js'
import type { AnyOfZodParser } from './anyOf.js'
import { anyOfZodParser } from './anyOf.js'
import type { BinaryZodParser } from './binary.js'
import { binaryZodParser } from './binary.js'
import type { BooleanZodParser } from './boolean.js'
import { booleanZodParser } from './boolean.js'
import type { ItemZodParser } from './item.js'
import { itemZodParser } from './item.js'
import type { ListZodParser } from './list.js'
import { listZodParser } from './list.js'
import type { MapZodParser } from './map.js'
import { mapZodParser } from './map.js'
import type { NullZodParser } from './null.js'
import { nullZodParser } from './null.js'
import type { NumberZodParser } from './number.js'
import { numberZodParser } from './number.js'
import type { RecordZodParser } from './record.js'
import { recordZodParser } from './record.js'
import type { SetZodParser } from './set.js'
import { getSetZodParser } from './set.js'
import type { StringZodParser } from './string.js'
import { getStringZodParser } from './string.js'
import type { ZodParserOptions } from './types.js'

export type ZodParser<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemZodParser<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? SchemaZodParser<SCHEMA, OPTIONS>
    : never

export type SchemaZodParser<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions = {}
> = Schema extends SCHEMA
  ? z.ZodTypeAny
  :
      | (SCHEMA extends AnySchema ? AnyZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends NullSchema ? NullZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends BooleanSchema ? BooleanZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends NumberSchema ? NumberZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends StringSchema ? StringZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends BinarySchema ? BinaryZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends SetSchema ? SetZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends ListSchema ? ListZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfZodParser<SCHEMA, OPTIONS> : never)

export const schemaZodParser = <SCHEMA extends Schema, OPTIONS extends ZodParserOptions = {}>(
  schema: SCHEMA,
  options: OPTIONS = {} as OPTIONS
): SchemaZodParser<SCHEMA, OPTIONS> => {
  type ZOD_PARSER = SchemaZodParser<SCHEMA, OPTIONS>

  switch (schema.type) {
    case 'any':
      return anyZodParser(schema, options) as ZOD_PARSER
    case 'null':
      return nullZodParser(schema, options) as ZOD_PARSER
    case 'boolean':
      return booleanZodParser(schema, options) as ZOD_PARSER
    case 'number':
      return numberZodParser(schema, options) as ZOD_PARSER
    case 'string':
      return getStringZodParser(schema, options) as ZOD_PARSER
    case 'binary':
      return binaryZodParser(schema, options) as ZOD_PARSER
    case 'set':
      return getSetZodParser(schema, options) as ZOD_PARSER
    case 'list':
      return listZodParser(schema, options) as ZOD_PARSER
    case 'map':
      return mapZodParser(schema, options) as ZOD_PARSER
    case 'record':
      return recordZodParser(schema, options) as ZOD_PARSER
    case 'anyOf':
      return anyOfZodParser(schema, options) as ZOD_PARSER
    case 'item':
      // NOTE: Should not happen
      return itemZodParser(schema, options) as unknown as ZOD_PARSER
  }
}
