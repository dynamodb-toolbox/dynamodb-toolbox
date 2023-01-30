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
  [$value]: VALUE
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$default]: ConstantAttributeDefaultValue<VALUE>
}

/**
 * Const attribute interface
 */
export type _ConstantAttribute<
  STATE extends _ConstantAttributeStateConstraint = _ConstantAttributeStateConstraint
> = {
  [$type]: 'constant'
  [$value]: STATE[$value]
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
  ) => _ConstantAttribute<O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _ConstantAttribute<O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ConstantAttribute<O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ConstantAttribute<O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _ConstantAttribute<O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ConstantAttributeDefaultValue<STATE[$value]>>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _ConstantAttribute<O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type ConstantAttributeStateConstraint<
  VALUE extends ResolvedAttribute = ResolvedAttribute
> = FreezeAttributeStateConstraint<_ConstantAttributeStateConstraint<VALUE>>

export type ConstantAttribute<
  STATE extends ConstantAttributeStateConstraint = ConstantAttributeStateConstraint
> = {
  path: string
  type: 'constant'
  value: STATE['value']
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  default: STATE['default']
}
