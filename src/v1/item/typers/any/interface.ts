import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { PropertyState } from '../property/interface'
import type { AnyDefaultValue } from './types'

interface AnyState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> extends PropertyState<R, H, K, S> {
  _default: D
}

/**
 * Any property interface
 */
export interface Any<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> extends AnyState<R, H, K, S, D> {
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
  required: <$R extends RequiredOption = AtLeastOnce>(nextRequired?: $R) => Any<$R, H, K, S, D>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Any<R, true, K, S, D>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Any<R, H, true, S, D>
  /**
   * Rename property before save commands
   */
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Any<R, H, K, $S, D>
  /**
   * Provide a default value for property, or tag property as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <$D extends AnyDefaultValue>(nextDefaultValue: $D) => Any<R, H, K, S, $D>
}