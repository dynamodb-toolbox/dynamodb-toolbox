import type { AtLeastOnce } from '../constants'
import type { $type, $defaults } from '../constants/attributeOptions'
import type { $AttributeSharedState, AttributeSharedState } from '../shared/interface'
import type { $Attribute, Attribute } from '../types/attribute'

type RecordAttributeKeysState = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
}

export type $RecordAttributeKeys = $Attribute & {
  [$type]: 'string'
  [$defaults]: {
    put: undefined
    update: undefined
  }
} & $AttributeSharedState<RecordAttributeKeysState>

export type RecordAttributeKeys = Attribute & {
  type: 'string'
  defaults: {
    put: undefined
    update: undefined
  }
} & AttributeSharedState<RecordAttributeKeysState>

type RecordAttributeElementsState = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
}

export type $RecordAttributeElements = $Attribute & {
  [$defaults]: {
    put: undefined
    update: undefined
  }
} & $AttributeSharedState<RecordAttributeElementsState>

export type RecordAttributeElements = Attribute & {
  defaults: {
    put: undefined
    update: undefined
  }
} & AttributeSharedState<RecordAttributeElementsState>
