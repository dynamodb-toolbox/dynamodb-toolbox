import type { AtLeastOnce } from '../constants/index.js'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive/interface.js'
import type { PrimitiveAttributeEnumValues } from '../primitive/types.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'

export interface SetAttributeState extends SharedAttributeState {
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
}

interface SetAttributeElementState {
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  enum: PrimitiveAttributeEnumValues<'string' | 'number' | 'binary'>
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

export type $SetAttributeElements = $PrimitiveAttributeNestedState<
  'string' | 'number' | 'binary',
  SetAttributeElementState
>

export type SetAttributeElements = PrimitiveAttribute<
  'string' | 'number' | 'binary',
  SetAttributeElementState
>
