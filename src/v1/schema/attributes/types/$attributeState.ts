import type { $AnyAttributeState } from '../any'
import type { $PrimitiveAttributeState } from '../primitive'
import type { $SetAttributeState } from '../set'
import type { $ListAttributeState } from '../list'
import type { $MapAttributeState } from '../map'
import type { $RecordAttributeState } from '../record'
import type { $AnyOfAttributeState } from '../anyOf'

/**
 * Any warm attribute state
 */
export type $AttributeState =
  | $AnyAttributeState
  | $PrimitiveAttributeState
  | $SetAttributeState
  | $ListAttributeState
  | $MapAttributeState
  | $RecordAttributeState
  | $AnyOfAttributeState

/**
 * Any warm schema attribute states
 */
export interface $SchemaAttributeStates {
  [key: string]: $AttributeState
}
