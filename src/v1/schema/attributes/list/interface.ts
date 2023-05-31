import type { O } from 'ts-toolbelt'

import type { ComputedDefault, RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $elements, $default } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { $ListAttributeElements, ListAttributeElements } from './types'

export interface ListAttributeStateConstraint extends AttributeSharedStateConstraint {
  default: ComputedDefault | undefined
}

/**
 * List attribute interface
 */
export interface $ListAttribute<
  $ELEMENTS extends $ListAttributeElements = $ListAttributeElements,
  STATE extends ListAttributeStateConstraint = ListAttributeStateConstraint
> extends $AttributeSharedState<STATE> {
  [$type]: 'list'
  [$elements]: $ELEMENTS
  [$default]: STATE['default']
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => $ListAttribute<$ELEMENTS, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $ListAttribute<$ELEMENTS, O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $ListAttribute<$ELEMENTS, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $ListAttribute<$ELEMENTS, O.Update<O.Update<STATE, 'key', true>, 'required', Always>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $ListAttribute<$ELEMENTS, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => $ListAttribute<$ELEMENTS, O.Update<STATE, 'default', NEXT_DEFAULT>>
}

export interface ListAttribute<
  ELEMENTS extends ListAttributeElements = ListAttributeElements,
  STATE extends ListAttributeStateConstraint = ListAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'list'
  elements: ELEMENTS
  default: STATE['default']
}
