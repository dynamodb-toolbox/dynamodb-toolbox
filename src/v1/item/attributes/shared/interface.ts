import { RequiredOption } from '../constants/requiredOptions'
import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'

import { FreezeAttributeStateConstraint } from './freezeAttributeStateConstraint'

export interface $AttributeSharedStateConstraint {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
}

export interface $AttributeSharedState<STATE extends $AttributeSharedStateConstraint> {
  [$required]: STATE[$required]
  [$hidden]: STATE[$hidden]
  [$key]: STATE[$key]
  [$savedAs]: STATE[$savedAs]
}

export type AttributeSharedStateConstraint = FreezeAttributeStateConstraint<$AttributeSharedStateConstraint>

export interface AttributeSharedState<STATE extends AttributeSharedStateConstraint> {
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
}
