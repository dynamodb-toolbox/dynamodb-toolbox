import type { AtLeastOnce } from '../constants'
import type { $PrimitiveAttributeNestedState } from '../primitive'
import type { PrimitiveAttributeEnumValues } from '../primitive/types'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'
import type { $AttributeNestedState, Attribute } from '../types'

type RecordAttributeKeysState = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  enum: PrimitiveAttributeEnumValues<'string'>
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
  links: {
    key: undefined
    put: undefined
    update: undefined
  }
  transform: undefined | unknown
}

export type $RecordAttributeKeys = $PrimitiveAttributeNestedState<
  'string',
  RecordAttributeKeysState
>

export type RecordAttributeKeys = Attribute & {
  type: 'string'
} & SharedAttributeState<RecordAttributeKeysState>

type RecordAttributeElementsState = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
  links: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export type $RecordAttributeElements = $AttributeNestedState &
  $SharedAttributeState<RecordAttributeElementsState>

export type RecordAttributeElements = Attribute & SharedAttributeState<RecordAttributeElementsState>
