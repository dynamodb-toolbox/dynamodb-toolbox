import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { $AttributeNestedState } from '../types/index.js'

export interface RecordAttributeElementConstraints extends SharedAttributeStateConstraint {
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
  [$state]: RecordAttributeElementConstraints
}

export type $RecordAttributeElements = $AttributeNestedState & {
  [$state]: RecordAttributeElementConstraints
}

// TODO: Re-introduce constraint?
export type RecordAttributeKeys = StringAttribute
