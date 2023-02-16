import type { O } from 'ts-toolbelt'

import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type {
  $type,
  $elements,
  $required,
  $hidden,
  $keys,
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

import type {
  $RecordAttributeKeys,
  RecordAttributeKeys,
  $RecordAttributeElements,
  RecordAttributeElements
} from './types'

interface $RecordAttributeStateConstraint extends $AttributeSharedStateConstraint {
  [$default]: ComputedDefault | undefined
}

/**
 * Record attribute interface
 */
export interface $RecordAttribute<
  $KEYS extends $RecordAttributeKeys = $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements = $RecordAttributeElements,
  $STATE extends $RecordAttributeStateConstraint = $RecordAttributeStateConstraint
> extends $AttributeSharedState<$STATE> {
  [$type]: 'record'
  [$keys]: $KEYS
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
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $required, NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $key, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => $RecordAttribute<$KEYS, $ELEMENTS, O.Update<$STATE, $default, NEXT_DEFAULT>>
}

export type RecordAttributeStateConstraint = FreezeAttributeStateConstraint<$RecordAttributeStateConstraint>

export interface RecordAttribute<
  KEYS extends RecordAttributeKeys = RecordAttributeKeys,
  ELEMENTS extends RecordAttributeElements = RecordAttributeElements,
  STATE extends RecordAttributeStateConstraint = RecordAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'record'
  keys: KEYS
  elements: ELEMENTS
  default: STATE['default']
}
