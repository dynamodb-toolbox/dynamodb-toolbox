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
import type {
  $AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { $ListAttributeElements, ListAttributeElements } from './types'

interface $ListAttributeStateConstraint extends $AttributeSharedStateConstraint {
  [$default]: ComputedDefault | undefined
}

/**
 * List attribute interface
 */
export interface $ListAttribute<
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements,
  $STATE extends $ListAttributeStateConstraint = $ListAttributeStateConstraint
> extends $AttributeSharedState<$STATE> {
  [$type]: 'list'
  [$elements]: $ELEMENTS
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
  ) => $ListAttribute<$ELEMENTS, O.Update<$STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $ListAttribute<$ELEMENTS, O.Update<$STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $ListAttribute<$ELEMENTS, O.Update<$STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $ListAttribute<$ELEMENTS, O.Update<$STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $ListAttribute<$ELEMENTS, O.Update<$STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => $ListAttribute<$ELEMENTS, O.Update<$STATE, $default, NEXT_DEFAULT>>
}

export type ListAttributeStateConstraint = FreezeAttributeStateConstraint<$ListAttributeStateConstraint>

export interface ListAttribute<
  ELEMENTS extends ListAttributeElements = ListAttributeElements,
  STATE extends ListAttributeStateConstraint = ListAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'list'
  elements: ELEMENTS
  default: STATE['default']
}
