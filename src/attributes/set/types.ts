import type { $BinaryAttributeNestedState, BinaryAttribute } from '../binary/index.js'
import type { BinaryAttributeStateConstraint } from '../binary/types.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $NumberAttributeNestedState, NumberAttribute } from '../number/index.js'
import type { NumberAttributeStateConstraint } from '../number/types.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { StringAttributeStateConstraint } from '../string/types.js'

interface SetAttributeElementState {
  required?: AtLeastOnce
  hidden?: false
  key?: boolean
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

export type $SetAttributeElements =
  | $NumberAttributeNestedState<NumberAttributeStateConstraint & SetAttributeElementState>
  | $StringAttributeNestedState<StringAttributeStateConstraint & SetAttributeElementState>
  | $BinaryAttributeNestedState<BinaryAttributeStateConstraint & SetAttributeElementState>

export type SetAttributeElements =
  | NumberAttribute<NumberAttributeStateConstraint & SetAttributeElementState>
  | StringAttribute<StringAttributeStateConstraint & SetAttributeElementState>
  | BinaryAttribute<BinaryAttributeStateConstraint & SetAttributeElementState>
