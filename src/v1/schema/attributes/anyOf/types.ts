import type { AtLeastOnce } from '../constants'
import type { $SharedAttributeState } from '../shared/interface'
import type { Attribute } from '../types/attribute'

export type $AnyOfAttributeElements = $SharedAttributeState<{
  required: AtLeastOnce
  hidden: false
  key: boolean
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
}>

export type AnyOfAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
}
