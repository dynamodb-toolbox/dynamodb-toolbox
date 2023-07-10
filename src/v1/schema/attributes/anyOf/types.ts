import type { AtLeastOnce } from '../constants'
import { $required, $hidden, $savedAs, $defaults } from '../constants/attributeOptions'
import type { $Attribute, Attribute } from '../types/attribute'

export type $AnyOfAttributeElements = $Attribute & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$defaults]: {
    put: undefined
    update: undefined
  }
}

export type AnyOfAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  defaults: {
    put: undefined
    update: undefined
  }
}