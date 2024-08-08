import type { SharedAttributeState } from '../shared/interface.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'
import type { Validator } from '../types/validator.js'

export interface MapAttributeState extends SharedAttributeState {
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
}

export interface $MapAttributeAttributeStates {
  [key: string]: $AttributeNestedState
}

export interface MapAttributeAttributes {
  [key: string]: Attribute
}
