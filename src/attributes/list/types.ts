import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { $AttributeNestedState } from '../types/index.js'
import type { Validator } from '../types/validator.js'

export interface ListAttributeState extends SharedAttributeState {
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
}

export type $ListAttributeElements = $AttributeNestedState & {
  [$state]: {
    required: AtLeastOnce
    hidden: false
    savedAs: undefined
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
  }
}
