import type { $BinaryAttributeNestedState, BinaryAttribute } from '../binary/index.js'
import type { BinaryAttributeState } from '../binary/types.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $NumberAttributeNestedState, NumberAttribute } from '../number/index.js'
import type { NumberAttributeState } from '../number/types.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { StringAttributeState } from '../string/types.js'

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
  | $NumberAttributeNestedState<NumberAttributeState & SetAttributeElementState>
  | $StringAttributeNestedState<StringAttributeState & SetAttributeElementState>
  | $BinaryAttributeNestedState<BinaryAttributeState & SetAttributeElementState>

export type SetAttributeElements =
  | NumberAttribute<NumberAttributeState & SetAttributeElementState>
  | StringAttribute<StringAttributeState & SetAttributeElementState>
  | BinaryAttribute<BinaryAttributeState & SetAttributeElementState>
