import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { ComputedDefault } from '../constants/computedDefault'
import type {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { FreezeAttributeStateConstraint } from '../shared/freezeAttributeStateConstraint'

import type { _SetAttributeElements, SetAttributeElements } from './types'

interface _SetAttributeStateConstraint {
  [$elements]: _SetAttributeElements
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$default]: ComputedDefault | undefined
}

/**
 * Set attribute interface
 */
export type _SetAttribute<
  STATE extends _SetAttributeStateConstraint = _SetAttributeStateConstraint
> = {
  [$type]: 'set'
  [$elements]: STATE[$elements]
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
  ) => _SetAttribute<O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _SetAttribute<O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _SetAttribute<O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _SetAttribute<O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _SetAttribute<O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _SetAttribute<O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type SetAttributeStateConstraint = {
  elements: SetAttributeElements
} & FreezeAttributeStateConstraint<Omit<_SetAttributeStateConstraint, $elements>>

export type SetAttribute<
  STATE extends SetAttributeStateConstraint = SetAttributeStateConstraint
> = STATE & {
  path: string
  type: 'set'
}
