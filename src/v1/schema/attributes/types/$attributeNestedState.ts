import type { $AnyAttributeNestedState } from '../any'
import type { $PrimitiveAttributeNestedState } from '../primitive'
import type { $SetAttributeNestedState } from '../set'
import type { $ListAttributeNestedState } from '../list'
import type { $MapAttributeNestedState } from '../map'
import type { $RecordAttributeNestedState } from '../record'
import type { $AnyOfAttributeNestedState } from '../anyOf'

/**
 * Any warm attribute nested state (i.e. with `freeze` method)
 */
export type $AttributeNestedState =
  | $AnyAttributeNestedState
  | $PrimitiveAttributeNestedState
  | $SetAttributeNestedState
  | $ListAttributeNestedState
  | $MapAttributeNestedState
  | $RecordAttributeNestedState
  | $AnyOfAttributeNestedState

/**
 * Any warm schema attribute states (i.e. with `freeze` method)
 */
export interface $SchemaAttributeNestedStates {
  [key: string]: $AttributeNestedState
}
