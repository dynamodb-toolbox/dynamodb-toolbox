import type { AnySchema } from '../any/index.js'
import type { AnyOfSchema } from '../anyOf/index.js'
import type { ListSchema } from '../list/index.js'
import type { MapSchema } from '../map/index.js'
import type { PrimitiveSchema } from '../primitive/index.js'
import type { RecordSchema } from '../record/index.js'
import type { SetSchema } from '../set/index.js'

/**
 * Any warm attribute state
 */
export type $AttributeState =
  | AnySchema
  | PrimitiveSchema
  | SetSchema
  | ListSchema
  | MapSchema
  | RecordSchema
  | AnyOfSchema

/**
 * Any warm schema attribute states
 */
export interface $SchemaAttributeStates {
  [key: string]: $AttributeState
}
