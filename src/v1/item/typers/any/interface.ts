import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { PropertyState } from '../property/interface'
import type { AnyDefaultValue } from './types'

interface AnyState<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends PropertyState<Required, Hidden, Key, SavedAs> {
  _default: Default
}

/**
 * Any property interface
 */
export interface Any<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends AnyState<Required, Hidden, Key, SavedAs, Default> {
  _type: 'any'
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => Any<NextRequired, Hidden, Key, SavedAs, Default>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Any<Required, true, Key, SavedAs, Default>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Any<Required, Hidden, true, SavedAs, Default>
  /**
   * Rename property before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Any<Required, Hidden, Key, NextSavedAs, Default>
  /**
   * Provide a default value for property, or tag property as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NextDefaultValue extends AnyDefaultValue>(
    nextDefaultValue: NextDefaultValue
  ) => Any<Required, Hidden, Key, SavedAs, NextDefaultValue>
}
