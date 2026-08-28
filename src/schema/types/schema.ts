import type { AnySchema, AnySchema_ } from '../any/index.js'
import type { AnyOfSchema, AnyOfSchema_ } from '../anyOf/index.js'
import type { ItemSchema, ItemSchema_ } from '../item/index.js'
import type { ListSchema, ListSchema_ } from '../list/index.js'
import type { MapSchema, MapSchema_ } from '../map/index.js'
import type { PrimitiveSchema, PrimitiveSchema_ } from '../primitive/index.js'
import type { RecordSchema, RecordSchema_ } from '../record/index.js'
import type { SetSchema, SetSchema_ } from '../set/index.js'
import type { TupleSchema, TupleSchema_ } from '../tuple/index.js'

/**
 * Union of every resolved schema type.
 */
export type Schema =
  | AnySchema
  | PrimitiveSchema
  | SetSchema
  | ListSchema
  | MapSchema
  | TupleSchema
  | RecordSchema
  | AnyOfSchema
  | ItemSchema

/**
 * Union of every builder (warm) schema type.
 */
export type Schema_ =
  | AnySchema_
  | PrimitiveSchema_
  | SetSchema_
  | ListSchema_
  | MapSchema_
  | TupleSchema_
  | RecordSchema_
  | AnyOfSchema_
  | ItemSchema_
