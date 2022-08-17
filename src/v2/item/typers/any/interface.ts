import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

interface AnyState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
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
   * - `AtLeastOnce` _(default)_: Required in PUTs, optional in UPDATEs
   * - `Never`: Optional in PUTs and UPDATEs
   * - `Always`: Required in PUTs and UPDATEs
   * - `OnlyOnce` (default): Required in PUTs, denied in UPDATEs
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
