import type { AnySchema, AnySchema_ } from '../any/index.js'
import type { AnyOfSchema, AnyOfSchema_ } from '../anyOf/index.js'
import type { ListSchema, ListSchema_ } from '../list/index.js'
import type { MapSchema, MapSchema_ } from '../map/index.js'
import type { PrimitiveSchema, PrimitiveSchema_ } from '../primitive/index.js'
import type { RecordSchema, RecordSchema_ } from '../record/index.js'
import type { SetSchema, SetSchema_ } from '../set/index.js'

/**
 * Any warm attribute props
 */
export type AttrSchema =
  | AnySchema
  | PrimitiveSchema
  | SetSchema
  | ListSchema
  | MapSchema
  | RecordSchema
  | AnyOfSchema

/**
 * Any warm attribute props (extended)
 */
export type AttrSchema_ =
  | AnySchema_
  | PrimitiveSchema_
  | SetSchema_
  | ListSchema_
  | MapSchema_
  | RecordSchema_
  | AnyOfSchema_

/**
 * Any warm schema attribute
 */
export interface SchemaAttributes {
  [key: string]: AttrSchema
}
