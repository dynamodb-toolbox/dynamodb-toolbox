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
import type {
  $AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { AnyAttributeDefaultValue } from './types'

interface $AnyAttributeStateConstraint extends $AttributeSharedStateConstraint {
  [$default]: AnyAttributeDefaultValue
}

/**
 * Any attribute interface
 */
export interface $AnyAttribute<
  $STATE extends $AnyAttributeStateConstraint = $AnyAttributeStateConstraint
> extends $AttributeSharedState<$STATE> {
  [$type]: 'any'
  [$default]: $STATE[$default]
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
  ) => $AnyAttribute<O.Update<$STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $AnyAttribute<O.Update<$STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $AnyAttribute<O.Update<$STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $AnyAttribute<O.Update<$STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $AnyAttribute<O.Update<$STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT_VALUE extends AnyAttributeDefaultValue>(
    nextDefaultValue: NEXT_DEFAULT_VALUE
  ) => $AnyAttribute<O.Update<$STATE, $default, NEXT_DEFAULT_VALUE>>
}

export type AnyAttributeStateConstraint = FreezeAttributeStateConstraint<$AnyAttributeStateConstraint>

export interface AnyAttribute<
  STATE extends AnyAttributeStateConstraint = AnyAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'any'
  default: STATE['default']
}
