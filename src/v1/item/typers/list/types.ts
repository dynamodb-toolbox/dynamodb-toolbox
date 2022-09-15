import type { AtLeastOnce } from '../constants'
import type { Property } from '../types/property'

export type ListProperty = Property & {
  _required: AtLeastOnce
  _hidden: false
  _savedAs: undefined
  _default: undefined
}
