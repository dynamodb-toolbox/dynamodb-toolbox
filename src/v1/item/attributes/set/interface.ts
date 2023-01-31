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
import type {
  _AttributeSharedStateConstraint,
  _AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { _SetAttributeElements, SetAttributeElements } from './types'

interface _SetAttributeStateConstraint extends _AttributeSharedStateConstraint {
  [$default]: ComputedDefault | undefined
}

/**
 * Set attribute interface
 */
export interface _SetAttribute<
  ELEMENTS extends _SetAttributeElements = _SetAttributeElements,
  STATE extends _SetAttributeStateConstraint = _SetAttributeStateConstraint
> extends _AttributeSharedState<STATE> {
  [$type]: 'set'
  [$elements]: ELEMENTS
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
  ) => _SetAttribute<ELEMENTS, O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _SetAttribute<ELEMENTS, O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _SetAttribute<ELEMENTS, O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _SetAttribute<ELEMENTS, O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _SetAttribute<ELEMENTS, O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _SetAttribute<ELEMENTS, O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type SetAttributeStateConstraint = FreezeAttributeStateConstraint<_SetAttributeStateConstraint>

export interface SetAttribute<
  ELEMENTS extends SetAttributeElements = SetAttributeElements,
  STATE extends SetAttributeStateConstraint = SetAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'set'
  elements: ELEMENTS
  default: STATE['default']
}
