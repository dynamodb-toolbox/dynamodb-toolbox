import type { $AnyAttributeState } from '../any/index.js'
import type { $AnyOfAttributeState } from '../anyOf/index.js'
import type { $BinaryAttributeState } from '../binary/index.js'
import type { $ListAttributeState } from '../list/index.js'
import type { $MapAttributeState } from '../map/index.js'
import type { $NumberAttributeState } from '../number/index.js'
import type { $PrimitiveAttributeState } from '../primitive/index.js'
import type { $RecordAttributeState } from '../record/index.js'
import type { $SetAttributeState } from '../set/index.js'
import type { $StringAttributeState } from '../string/index.js'

/**
 * Any warm attribute state
 */
export type $AttributeState =
  | $AnyAttributeState
  | $NumberAttributeState
  | $StringAttributeState
  | $BinaryAttributeState
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
