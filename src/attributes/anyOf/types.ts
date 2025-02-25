import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'

interface AnyOfAttributeElementState extends SharedAttributeState {
  required?: AtLeastOnce
  hidden?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

export type $AnyOfAttributeElements = $AttributeNestedState & {
  state: AnyOfAttributeElementState
}

export type AnyOfAttributeElements = Attribute & {
  state: AnyOfAttributeElementState
}
