import type { RequiredOption } from '../constants/requiredOptions'
import type { $required, $hidden, $key, $savedAs, $defaults } from '../constants/attributeOptions'

export interface SharedAttributeStateConstraint {
  required: RequiredOption
  hidden: boolean
  key: boolean
  savedAs: string | undefined
  defaults: {
    key: undefined | unknown
    put: undefined | unknown
    update: undefined | unknown
  }
}

export interface $SharedAttributeState<STATE extends SharedAttributeStateConstraint> {
  [$required]: STATE['required']
  [$hidden]: STATE['hidden']
  [$key]: STATE['key']
  [$savedAs]: STATE['savedAs']
  [$defaults]: STATE['defaults']
}

export interface SharedAttributeState<STATE extends SharedAttributeStateConstraint> {
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  defaults: STATE['defaults']
}
