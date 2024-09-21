import type { $BinaryAttributeNestedState, BinaryAttribute } from '../binary/index.js'
import type { BinaryAttributeState } from '../binary/types.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $NumberAttributeNestedState, NumberAttribute } from '../number/index.js'
import type { NumberAttributeState } from '../number/types.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { StringAttributeState } from '../string/types.js'

interface SetAttributeElementStateV2 {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  defaults: { key: undefined; put: undefined; update: undefined }
  links: { key: undefined; put: undefined; update: undefined }
}

export type $SetAttributeElements =
  | $NumberAttributeNestedState<NumberAttributeState & SetAttributeElementStateV2>
  | $StringAttributeNestedState<StringAttributeState & SetAttributeElementStateV2>
  | $BinaryAttributeNestedState<BinaryAttributeState & SetAttributeElementStateV2>

export type SetAttributeElements =
  | NumberAttribute<NumberAttributeState & SetAttributeElementStateV2>
  | StringAttribute<StringAttributeState & SetAttributeElementStateV2>
  | BinaryAttribute<BinaryAttributeState & SetAttributeElementStateV2>
