import type { SharedAttributeState } from '../shared/interface.js'
import type { Validator } from '../types/validator.js'

export interface AnyAttributeState extends SharedAttributeState {
  castAs: unknown
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
}
