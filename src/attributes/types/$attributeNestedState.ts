import type { $AnyAttributeNestedState } from '../any/index.js'
import type { $AnyOfAttributeNestedState } from '../anyOf/index.js'
import type { $ListAttributeNestedState } from '../list/index.js'
import type { $MapAttributeNestedState } from '../map/index.js'
import type { $NumberAttributeNestedState } from '../number/index.js'
import type { $PrimitiveAttributeNestedState } from '../primitive/index.js'
import type { $RecordAttributeNestedState } from '../record/index.js'
import type { $SetAttributeNestedState } from '../set/index.js'

/**
 * Any warm attribute nested state (i.e. with `freeze` method)
 */
export type $AttributeNestedState =
  | $AnyAttributeNestedState
  | $NumberAttributeNestedState
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
