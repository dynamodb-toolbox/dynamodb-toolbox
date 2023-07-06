import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { ComputedDefault } from '../constants/computedDefault'
import type { $type, $elements, $defaults } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { $SetAttributeElements, SetAttributeElements } from './types'

interface SetAttributeStateConstraint extends AttributeSharedStateConstraint {
  defaults: {
    key: ComputedDefault | undefined
    put: ComputedDefault | undefined
    update: ComputedDefault | undefined
  }
}

/**
 * Set attribute interface
 */
export interface $SetAttribute<
  $ELEMENTS extends $SetAttributeElements = $SetAttributeElements,
  STATE extends SetAttributeStateConstraint = SetAttributeStateConstraint
> extends $AttributeSharedState<STATE> {
  [$type]: 'set'
  [$elements]: $ELEMENTS
  [$defaults]: STATE['defaults']
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
  ) => $SetAttribute<$ELEMENTS, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $SetAttribute<$ELEMENTS, O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $SetAttribute<$ELEMENTS, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $SetAttribute<$ELEMENTS, O.Update<O.Update<STATE, 'key', true>, 'required', Always>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $SetAttribute<$ELEMENTS, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `ComputedDefault`
   */
  keyDefault: <NEXT_KEY_DEFAULT extends ComputedDefault | undefined>(
    nextKeyDefault: NEXT_KEY_DEFAULT
  ) => $SetAttribute<
    $ELEMENTS,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'key', NEXT_KEY_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `ComputedDefault`
   */
  putDefault: <NEXT_PUT_DEFAULT extends ComputedDefault | undefined>(
    nextPutDefault: NEXT_PUT_DEFAULT
  ) => $SetAttribute<
    $ELEMENTS,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'put', NEXT_PUT_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `ComputedDefault`
   */
  updateDefault: <NEXT_UPDATE_DEFAULT extends ComputedDefault | undefined>(
    nextUpdateDefault: NEXT_UPDATE_DEFAULT
  ) => $SetAttribute<
    $ELEMENTS,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'update', NEXT_UPDATE_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands / Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextUpdateDefault: NEXT_DEFAULT
  ) => $SetAttribute<
    $ELEMENTS,
    O.Update<
      STATE,
      'defaults',
      O.Update<STATE['defaults'], STATE['key'] extends true ? 'key' : 'put', NEXT_DEFAULT>
    >
  >
}

export interface SetAttribute<
  ELEMENTS extends SetAttributeElements = SetAttributeElements,
  STATE extends SetAttributeStateConstraint = SetAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'set'
  elements: ELEMENTS
  defaults: STATE['defaults']
}
