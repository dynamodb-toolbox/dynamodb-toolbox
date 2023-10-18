import type { AtLeastOnce } from '../constants'
import type { $PrimitiveAttributeState } from '../primitive'
import type { PrimitiveAttributeEnumValues } from '../primitive/types'
import type { $SharedAttributeState, SharedAttributeState } from '../shared/interface'
import type { $AttributeState, Attribute } from '../types/attribute'

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
}

export type $RecordAttributeKeys = $PrimitiveAttributeState<'string', RecordAttributeKeysState>

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
}

export type $RecordAttributeElements = $AttributeState &
  $SharedAttributeState<RecordAttributeElementsState>

export type RecordAttributeElements = Attribute & SharedAttributeState<RecordAttributeElementsState>
