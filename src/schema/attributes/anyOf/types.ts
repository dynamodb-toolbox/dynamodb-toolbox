import type {
  $defaults,
  $hidden,
  $links,
  $required,
  $savedAs
} from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'

export type $AnyOfAttributeElements = $AttributeNestedState & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$defaults]: {
    key: undefined
    put: undefined
    update: undefined
  }
  [$links]: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export type AnyOfAttributeElements = Attribute & {
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
