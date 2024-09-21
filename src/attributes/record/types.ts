import type { $state } from '../constants/attributeOptions.js'
import type { AtLeastOnce } from '../constants/index.js'
import type { $StringAttributeNestedState, StringAttribute } from '../string/index.js'
import type { StringAttributeState } from '../string/types.js'
import type { $AttributeNestedState } from '../types/index.js'

export type RecordAttributeElementConstraints = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  defaults: { key: undefined; put: undefined; update: undefined }
  links: { key: undefined; put: undefined; update: undefined }
}

export type $RecordAttributeKeys = $StringAttributeNestedState<
  StringAttributeState & RecordAttributeElementConstraints
>

export type $RecordAttributeElements = $AttributeNestedState & {
  [$state]: RecordAttributeElementConstraints
}

export type RecordAttributeKeys = StringAttribute
