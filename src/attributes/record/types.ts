import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $PrimitiveAttributeNestedState, PrimitiveAttribute } from '../primitive/index.js'
import type { PrimitiveAttributeEnumValues } from '../primitive/types.js'
import type { $AttributeNestedState } from '../types/index.js'
import type { Validator } from '../types/validator.js'

export type $RecordAttributeKeys = $PrimitiveAttributeNestedState<
  'string',
  {
    required: AtLeastOnce
    hidden: false
    key: false
    savedAs: undefined
    enum: PrimitiveAttributeEnumValues<'string'>
    transform: undefined | unknown
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
    validators: {
      key: undefined | Validator
      put: undefined | Validator
      update: undefined | Validator
    }
  }
>

export type RecordAttributeElementConstraints = {
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

export type $RecordAttributeElements = $AttributeNestedState & {
  [$state]: RecordAttributeElementConstraints
}

export type RecordAttributeKeys = PrimitiveAttribute<'string'>
