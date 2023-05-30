import type { AtLeastOnce } from '../constants'
import { $required, $hidden, $savedAs, $default } from '../constants/attributeOptions'
import type { $Attribute, Attribute } from '../types/attribute'

export type $AnyOfAttributeElements = $Attribute & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$default]: undefined
}

export type AnyOfAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  default: undefined
}
