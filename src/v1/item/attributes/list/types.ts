import type { AtLeastOnce } from '../constants'
import type { _Attribute, FrozenAttribute } from '../types/attribute'

export type ListAttributeElements = _Attribute & {
  _required: AtLeastOnce
  _hidden: false
  _savedAs: undefined
  _default: undefined
}

export type FrozenListAttributeElements = FrozenAttribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  default: undefined
}
