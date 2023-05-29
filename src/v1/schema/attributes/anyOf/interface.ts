import type { O } from 'ts-toolbelt'

import type { ComputedDefault, RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $elements, $default } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'
import type { $Attribute, Attribute } from '../types'

export interface AnyOfAttributeStateConstraint extends AttributeSharedStateConstraint {
  default: ComputedDefault | undefined
}

/**
 * AnyOf attribute interface
 */
export interface $AnyOfAttribute<
  $ELEMENTS extends $Attribute = $Attribute,
  STATE extends AnyOfAttributeStateConstraint = AnyOfAttributeStateConstraint
> extends $AttributeSharedState<STATE> {
  [$type]: 'anyOf'
  [$elements]: $ELEMENTS[]
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
  ) => $AnyOfAttribute<$ELEMENTS, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $AnyOfAttribute<$ELEMENTS, O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $AnyOfAttribute<$ELEMENTS, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $AnyOfAttribute<$ELEMENTS, O.Update<O.Update<STATE, 'key', true>, 'required', Always>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $AnyOfAttribute<$ELEMENTS, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => $AnyOfAttribute<$ELEMENTS, O.Update<STATE, 'default', NEXT_DEFAULT>>
}

export interface AnyOfAttribute<
  ELEMENTS extends Attribute = Attribute,
  STATE extends AnyOfAttributeStateConstraint = AnyOfAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'anyOf'
  elements: ELEMENTS[]
  default: STATE['default']
}
