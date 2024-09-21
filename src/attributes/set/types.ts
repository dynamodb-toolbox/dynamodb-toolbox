import type { AtLeastOnce } from '../constants/index.js'
import type { $NumberAttributeNestedState, NumberAttribute } from '../number/index.js'
import type { NumberAttributeState } from '../number/types.js'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive/interface.js'
import type { PrimitiveAttributeEnumValues } from '../primitive/types.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { StringAttributeState } from '../string/types.js'
import type { Validator } from '../types/validator.js'

/**
 * @deprecated
 */
interface SetAttributeElementState {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  enum: PrimitiveAttributeEnumValues<'binary'>
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
  links: {
    key: undefined
    put: undefined
    update: undefined
  }
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
  transform: undefined | unknown
}

interface SetAttributeElementStateV2 {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  defaults: { key: undefined; put: undefined; update: undefined }
  links: { key: undefined; put: undefined; update: undefined }
}

export type $SetAttributeElements =
  | $PrimitiveAttributeNestedState<'binary', SetAttributeElementState>
  | $NumberAttributeNestedState<NumberAttributeState & SetAttributeElementStateV2>
  | $StringAttributeNestedState<StringAttributeState & SetAttributeElementStateV2>

export type SetAttributeElements =
  | PrimitiveAttribute<'binary', SetAttributeElementState>
  | NumberAttribute<NumberAttributeState & SetAttributeElementStateV2>
  | StringAttribute<StringAttributeState & SetAttributeElementStateV2>
