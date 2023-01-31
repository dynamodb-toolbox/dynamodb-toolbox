import { RequiredOption } from '../constants/requiredOptions'
import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'

import { FreezeAttributeStateConstraint } from './freezeAttributeStateConstraint'

export interface _AttributeSharedStateConstraint {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
}

export interface _AttributeSharedState<STATE extends _AttributeSharedStateConstraint> {
  [$required]: STATE[$required]
  [$hidden]: STATE[$hidden]
  [$key]: STATE[$key]
  [$savedAs]: STATE[$savedAs]
}

export type AttributeSharedStateConstraint = FreezeAttributeStateConstraint<_AttributeSharedStateConstraint>

export interface AttributeSharedState<STATE extends AttributeSharedStateConstraint> {
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
}
