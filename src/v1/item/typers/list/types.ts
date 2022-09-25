import type { AtLeastOnce } from '../constants'
import type { Attribute } from '../types/attribute'

export type ListElements = Attribute & {
  _required: AtLeastOnce
  _hidden: false
  _savedAs: undefined
  _default: undefined
}
