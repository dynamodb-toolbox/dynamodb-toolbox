import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type {
  $type,
  $value,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { FreezeAttributeStateConstraint } from '../shared/freezeAttributeStateConstraint'
import type { ResolvedAttribute } from '../types'

import type { ConstantAttributeDefaultValue } from './types'

interface _ConstantAttributeStateConstraint<VALUE extends ResolvedAttribute = ResolvedAttribute> {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$default]: ConstantAttributeDefaultValue<VALUE>
}

/**
 * Const attribute interface
 */
export interface _ConstantAttribute<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  STATE extends _ConstantAttributeStateConstraint<VALUE> = _ConstantAttributeStateConstraint<VALUE>
> {
  [$type]: 'constant'
  [$value]: VALUE
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
  ) => _ConstantAttribute<VALUE, O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _ConstantAttribute<VALUE, O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ConstantAttribute<VALUE, O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ConstantAttribute<VALUE, O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _ConstantAttribute<VALUE, O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ConstantAttributeDefaultValue<VALUE>>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _ConstantAttribute<VALUE, O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type ConstantAttributeStateConstraint<
  VALUE extends ResolvedAttribute = ResolvedAttribute
> = FreezeAttributeStateConstraint<_ConstantAttributeStateConstraint<VALUE>>

export interface ConstantAttribute<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  STATE extends ConstantAttributeStateConstraint = ConstantAttributeStateConstraint
> {
  path: string
  type: 'constant'
  value: VALUE
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  default: STATE['default']
}
