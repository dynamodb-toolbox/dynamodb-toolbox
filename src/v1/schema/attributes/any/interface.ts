import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce, Never, Always } from '../constants/requiredOptions'
import type { $type, $defaults } from '../constants/attributeOptions'
import type {
  AttributeSharedStateConstraint,
  $AttributeSharedState,
  AttributeSharedState
} from '../shared/interface'

import type { AnyAttributeDefaultValue } from './types'

export interface AnyAttributeStateConstraint extends AttributeSharedStateConstraint {
  defaults: {
    key: AnyAttributeDefaultValue
    put: AnyAttributeDefaultValue
    update: AnyAttributeDefaultValue
  }
}

/**
 * Any attribute interface
 */
export interface $AnyAttribute<
  STATE extends AnyAttributeStateConstraint = AnyAttributeStateConstraint
> extends $AttributeSharedState<STATE> {
  [$type]: 'any'
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
  ) => $AnyAttribute<O.Update<STATE, 'required', NEXT_IS_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => $AnyAttribute<O.Update<STATE, 'required', Never>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => $AnyAttribute<O.Update<STATE, 'hidden', true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => $AnyAttribute<O.Update<O.Update<STATE, 'key', true>, 'required', Always>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => $AnyAttribute<O.Update<STATE, 'savedAs', NEXT_SAVED_AS>>
  /**
   * Provide a default value for attribute in Primary Key computing
   *
   * @param nextKeyDefault `any`, `() => any`, `ComputedDefault`
   */
  keyDefault: <NEXT_KEY_DEFAULT extends AnyAttributeDefaultValue>(
    nextKeyDefault: NEXT_KEY_DEFAULT
  ) => $AnyAttribute<
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'key', NEXT_KEY_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands
   *
   * @param nextPutDefault `any`, `() => any`, `ComputedDefault`
   */
  putDefault: <NEXT_PUT_DEFAULT extends AnyAttributeDefaultValue>(
    nextPutDefault: NEXT_PUT_DEFAULT
  ) => $AnyAttribute<
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'put', NEXT_PUT_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in UPDATE commands
   *
   * @param nextUpdateDefault `any`, `() => any`, `ComputedDefault`
   */
  updateDefault: <NEXT_UPDATE_DEFAULT extends AnyAttributeDefaultValue>(
    nextUpdateDefault: NEXT_UPDATE_DEFAULT
  ) => $AnyAttribute<
    O.Update<STATE, 'defaults', O.Update<STATE['defaults'], 'update', NEXT_UPDATE_DEFAULT>>
  >
  /**
   * Provide a default value for attribute in PUT commands / Primary Key computing if attribute is tagged as key
   *
   * @param nextDefault `any`, `() => any`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends AnyAttributeDefaultValue>(
    nextDefault: NEXT_DEFAULT
  ) => $AnyAttribute<
    O.Update<
      STATE,
      'defaults',
      O.Update<STATE['defaults'], STATE['key'] extends true ? 'key' : 'put', NEXT_DEFAULT>
    >
  >
}

export interface AnyAttribute<
  STATE extends AnyAttributeStateConstraint = AnyAttributeStateConstraint
> extends AttributeSharedState<STATE> {
  path: string
  type: 'any'
  defaults: STATE['defaults']
}
