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
  StringSchema,
  TupleSchema
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
import { setZodParser } from './set.js'
import type { StringZodParser } from './string.js'
import { stringZodParser } from './string.js'
import type { TupleZodParser } from './tuple.js'
import { tupleZodParser } from './tuple.js'
import type { ZodParserOptions } from './types.js'

/**
 * Zod schema validating an input value, for any schema.
 */
export type ZodParser<
  SCHEMA extends Schema,
  OPTIONS extends ZodParserOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemZodParser<SCHEMA, OPTIONS>
  : SCHEMA extends Schema
    ? SchemaZodParser<SCHEMA, OPTIONS>
    : never

/**
 * Zod schema validating an input non-item value.
 */
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
      | (SCHEMA extends TupleSchema ? TupleZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends MapSchema ? MapZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends RecordSchema ? RecordZodParser<SCHEMA, OPTIONS> : never)
      | (SCHEMA extends AnyOfSchema ? AnyOfZodParser<SCHEMA, OPTIONS> : never)

/**
 * Dispatch a schema to the Zod parser of its type.
 */
export const schemaZodParser = <SCHEMA extends Schema, OPTIONS extends ZodParserOptions = {}>(
  schema: SCHEMA,
  options: OPTIONS = {} as OPTIONS
): SchemaZodParser<SCHEMA, OPTIONS> => {
  switch (schema.type) {
    case 'any':
      return anyZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'null':
      return nullZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'boolean':
      return booleanZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'number':
      return numberZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'string':
      return stringZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'binary':
      return binaryZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'set':
      return setZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'list':
      return listZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'tuple':
      return tupleZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'map':
      return mapZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'record':
      return recordZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'anyOf':
      return anyOfZodParser(schema, options) as SchemaZodParser<SCHEMA, OPTIONS>
    case 'item':
      // NOTE: Should not happen
      return itemZodParser(schema, options) as unknown as SchemaZodParser<SCHEMA, OPTIONS>
  }
}
