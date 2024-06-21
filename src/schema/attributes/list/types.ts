import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $AttributeNestedState } from '../types/index.js'

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
