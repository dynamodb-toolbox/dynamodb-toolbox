import type { RequiredOption } from '../constants/requiredOptions'
import type { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'

export interface AttributeSharedStateConstraint {
  required: RequiredOption
  hidden: boolean
  key: boolean
  savedAs: string | undefined
}

export interface $AttributeSharedState<STATE extends AttributeSharedStateConstraint> {
  [$required]: STATE['required']
  [$hidden]: STATE['hidden']
  [$key]: STATE['key']
  [$savedAs]: STATE['savedAs']
}

export interface AttributeSharedState<STATE extends AttributeSharedStateConstraint> {
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
}
