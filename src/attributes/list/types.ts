import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'

interface ListAttributeElementState extends SharedAttributeState {
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

export type $ListAttributeElements = $AttributeNestedState & {
  state: ListAttributeElementState
}

export type ListAttributeElements = Attribute & { state: ListAttributeElementState }
