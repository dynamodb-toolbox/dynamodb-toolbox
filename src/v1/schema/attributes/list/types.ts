import type { AtLeastOnce } from '../constants'
import type { $required, $hidden, $savedAs, $defaults } from '../constants/attributeOptions'
import type { $AttributeState, Attribute } from '../types/attribute'

export type $ListAttributeElements = $AttributeState & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$defaults]: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export type ListAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
}
