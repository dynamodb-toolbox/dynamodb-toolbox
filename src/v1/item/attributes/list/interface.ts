import type { O } from 'ts-toolbelt'

import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
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

import type { _ListAttributeElements, ListAttributeElements } from './types'

interface _ListAttributeStateConstraint {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$savedAs]: string | undefined
  [$default]: ComputedDefault | undefined
}

/**
 * List attribute interface
 */
export interface _ListAttribute<
  ELEMENTS extends _ListAttributeElements = _ListAttributeElements,
  STATE extends _ListAttributeStateConstraint = _ListAttributeStateConstraint
> {
  [$type]: 'list'
  [$elements]: ELEMENTS
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
  ) => _ListAttribute<ELEMENTS, O.Update<STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _ListAttribute<ELEMENTS, O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ListAttribute<ELEMENTS, O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ListAttribute<ELEMENTS, O.Update<STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _ListAttribute<ELEMENTS, O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _ListAttribute<ELEMENTS, O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type ListAttributeStateConstraint = FreezeAttributeStateConstraint<_ListAttributeStateConstraint>

export interface ListAttribute<
  ELEMENTS extends ListAttributeElements = ListAttributeElements,
  STATE extends ListAttributeStateConstraint = ListAttributeStateConstraint
> {
  path: string
  type: 'list'
  elements: ELEMENTS
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  savedAs: STATE['savedAs']
  default: STATE['default']
}
