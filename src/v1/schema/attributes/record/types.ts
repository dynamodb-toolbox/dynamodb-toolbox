import type { AtLeastOnce } from '../constants'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive'
import type { PrimitiveAttributeEnumValues } from '../primitive/types'
import type { $SharedAttributeState } from '../shared/interface'
import type { $AttributeNestedState } from '../types'

export type $RecordAttributeKeys = $PrimitiveAttributeNestedState<
  'string',
  {
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
>

export type $RecordAttributeElements = $AttributeNestedState &
  $SharedAttributeState<{
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
  }>

export type RecordAttributeKeys = PrimitiveAttribute<'string'>
