import type { O } from 'ts-toolbelt'

import type { ComputedDefault, RequiredOption, AtLeastOnce, Never, Always } from '../constants'
import type { $type, $elements, $keys, $defaults } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type {
  $RecordAttributeKeys,
  RecordAttributeKeys,
  $RecordAttributeElements,
  RecordAttributeElements
} from './types'

export interface RecordAttributeStateConstraint extends AttributeSharedStateConstraint {
  defaults: {
    put: ComputedDefault | undefined
    update: ComputedDefault | undefined
  }
}

/**
 * Record attribute interface
 */
export interface $RecordAttribute<
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements,
  STATE extends RecordAttributeStateConstraint = RecordAttributeStateConstraint
> extends $AttributeSharedState<STATE> {
  [$type]: 'record'
  [$keys]: $KEYS
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
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Update<O.Update<STATE, 'key', true>, 'required', Always>
  >
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value in PUT commands
   *
   * @param nextPutDefault `ComputedDefault`
   */
  putDefault: <NEXT_PUT_DEFAULT extends ComputedDefault | undefined>(
    nextPutDefault: NEXT_PUT_DEFAULT
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'put', NEXT_PUT_DEFAULT>>
  >
  /**
   * Tag attribute as having a computed default value in UPDATE commands
   *
   * @param nextUpdateDefault `ComputedDefault`
   */
  updateDefault: <NEXT_UPDATE_DEFAULT extends ComputedDefault | undefined>(
    nextUpdateDefault: NEXT_UPDATE_DEFAULT
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'update', NEXT_UPDATE_DEFAULT>>
  >
  /**
   * Tag attribute as having computed default values in all commands
   *
   * @param nextDefaults `ComputedDefault`
   */
  defaults: <NEXT_DEFAULTS extends ComputedDefault | undefined>(
    nextDefaults: NEXT_DEFAULTS
  ) => $RecordAttribute<
    $KEYS,
    $ELEMENTS,
    O.Update<STATE, 'defaults', { put: NEXT_DEFAULTS; update: NEXT_DEFAULTS }>
  >
}

export interface RecordAttribute<
  KEYS extends RecordAttributeKeys = RecordAttributeKeys,
  ELEMENTS extends RecordAttributeElements = RecordAttributeElements,
  STATE extends RecordAttributeStateConstraint = RecordAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'record'
  keys: KEYS
  elements: ELEMENTS
  defaults: STATE['defaults']
}
