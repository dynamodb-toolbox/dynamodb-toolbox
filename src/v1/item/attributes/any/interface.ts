import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { FreezeAttributeStateConstraint } from '../shared/freezeAttributeStateConstraint'

import type { AnyAttributeDefaultValue } from './types'

interface _AnyAttributeStateConstraint {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$default]: AnyAttributeDefaultValue
}

/**
 * Any attribute interface
 */
export interface _AnyAttribute<
  STATE extends _AnyAttributeStateConstraint = _AnyAttributeStateConstraint
> {
  [$type]: 'any'
  [$required]: STATE[$required]
  [$hidden]: STATE[$hidden]
  [$key]: STATE[$key]
  [$savedAs]: STATE[$savedAs]
  [$default]: STATE[$default]
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => _AnyAttribute<O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _AnyAttribute<O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _AnyAttribute<O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _AnyAttribute<O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _AnyAttribute<O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT_VALUE extends AnyAttributeDefaultValue>(
    nextDefaultValue: NEXT_DEFAULT_VALUE
  ) => _AnyAttribute<O.Update<STATE, $default, NEXT_DEFAULT_VALUE>>
}

export type AnyAttributeStateConstraint = FreezeAttributeStateConstraint<_AnyAttributeStateConstraint>

export interface AnyAttribute<
  STATE extends AnyAttributeStateConstraint = AnyAttributeStateConstraint
> {
  path: string
  type: 'any'
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  default: STATE['default']
}
