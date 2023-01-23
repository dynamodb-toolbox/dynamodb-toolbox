import type { AtLeastOnce } from '../constants'
import type { _Attribute, Attribute } from '../types/attribute'
import { $required, $hidden, $savedAs, $default } from '../constants/symbols'

export type _ListAttributeElements = _Attribute & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$savedAs]: undefined
  [$default]: undefined
}

export type ListAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  default: undefined
}
