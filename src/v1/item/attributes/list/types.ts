import type { AtLeastOnce } from '../constants'
import type { _Attribute, Attribute } from '../types/attribute'

export type _ListAttributeElements = _Attribute & {
  _required: AtLeastOnce
  _hidden: false
  _savedAs: undefined
  _default: undefined
}

export type ListAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  default: undefined
}
