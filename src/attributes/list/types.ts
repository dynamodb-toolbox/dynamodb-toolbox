import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'

export type ListAttributeElementConstraints = {
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

export type $ListAttributeElements = $AttributeNestedState & {
  [$state]: ListAttributeElementConstraints
}

export type ListAttributeElements = Attribute & ListAttributeElementConstraints
