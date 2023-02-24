import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { $type, $value, $default } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'
import type { ResolvedAttribute } from '../types'

import type { ConstantAttributeDefaultValue } from './types'

export interface ConstantAttributeStateConstraint<
  VALUE extends ResolvedAttribute = ResolvedAttribute
> extends AttributeSharedStateConstraint {
  default: ConstantAttributeDefaultValue<VALUE>
}

/**
 * Const attribute interface
 */
export interface $ConstantAttribute<
  $VALUE extends ResolvedAttribute = ResolvedAttribute,
  STATE extends ConstantAttributeStateConstraint<$VALUE> = ConstantAttributeStateConstraint<$VALUE>
> extends $AttributeSharedState<STATE> {
  [$type]: 'constant'
  [$value]: $VALUE
  [$default]: STATE['default']
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
  ) => $ConstantAttribute<$VALUE, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $ConstantAttribute<$VALUE, O.Update<STATE, 'required', 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $ConstantAttribute<$VALUE, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $ConstantAttribute<$VALUE, O.Update<STATE, 'key', true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $ConstantAttribute<$VALUE, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ConstantAttributeDefaultValue<$VALUE>>(
    nextDefaultValue: NEXT_DEFAULT
  ) => $ConstantAttribute<$VALUE, O.Update<STATE, 'default', NEXT_DEFAULT>>
}

export interface ConstantAttribute<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  STATE extends ConstantAttributeStateConstraint = ConstantAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'constant'
  value: VALUE
  default: STATE['default']
}
