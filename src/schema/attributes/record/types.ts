import type { AtLeastOnce } from '../constants/index.js'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive/index.js'
import type { PrimitiveAttributeEnumValues } from '../primitive/types.js'
import type { $SharedAttributeState } from '../shared/interface.js'
import type { $AttributeNestedState } from '../types/index.js'

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
