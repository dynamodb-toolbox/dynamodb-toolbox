import type { $AnyAttribute } from '../any'
import type { $PrimitiveAttribute } from '../primitive'
import type { $SetAttribute } from '../set'
import type { $ListAttribute } from '../list'
import type { $MapAttribute } from '../map'
import type { $RecordAttribute } from '../record'
import type { $AnyOfAttribute } from '../anyOf'

/**
 * Any warm attribute
 */
export type $Attribute =
  | $AnyAttribute
  | $PrimitiveAttribute
  | $SetAttribute
  | $ListAttribute
  | $MapAttribute
  | $RecordAttribute
  | $AnyOfAttribute

/**
 * Any warm schema attributes
 */
export interface $SchemaAttributes {
  [key: string]: $Attribute
}
