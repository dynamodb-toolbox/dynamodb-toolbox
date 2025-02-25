import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import type { $AttributeNestedState, Attribute } from '../types/index.js'

interface ListAttributeElementStateConstraints extends SharedAttributeStateConstraint {
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
  [$state]: ListAttributeElementStateConstraints
}

export type ListAttributeElements = Attribute & { state: ListAttributeElementStateConstraints }
