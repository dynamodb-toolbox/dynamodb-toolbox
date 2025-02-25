import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { $AttributeNestedState } from '../types/index.js'

export interface RecordAttributeElementState extends SharedAttributeState {
  required?: AtLeastOnce
  hidden?: false
  key?: false
  savedAs?: undefined
  keyDefault?: undefined
  putDefault?: undefined
  updateDefault?: undefined
  keyLink?: undefined
  putLink?: undefined
  updateLink?: undefined
}

export type $RecordAttributeKeys = $StringAttributeNestedState & {
  state: RecordAttributeElementState
}

export type $RecordAttributeElements = $AttributeNestedState & {
  state: RecordAttributeElementState
}

// TODO: Re-introduce constraint?
export type RecordAttributeKeys = StringAttribute
