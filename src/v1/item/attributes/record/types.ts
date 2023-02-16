import type { AtLeastOnce } from '../constants'
import { $type, $required, $hidden, $key, $savedAs, $default } from '../constants/attributeOptions'
import type { $Attribute, Attribute } from '../types/attribute'

export type $RecordAttributeKeys = $Attribute & {
  [$type]: 'string'
  [$required]: AtLeastOnce
  [$hidden]: false
  [$key]: false
  [$savedAs]: undefined
  [$default]: undefined
}

export type RecordAttributeKeys = Attribute & {
  type: 'string'
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  default: undefined
}

export type $RecordAttributeElements = $Attribute & {
  [$required]: AtLeastOnce
  [$hidden]: false
  [$key]: false
  [$savedAs]: undefined
  [$default]: undefined
}

export type RecordAttributeElements = Attribute & {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  default: undefined
}
