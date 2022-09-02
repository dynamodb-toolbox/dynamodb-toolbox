import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { ListProperty } from './types'

interface ListState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

/**
 * List property interface
 */
export interface List<
  E extends ListProperty = ListProperty,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends ListState<R, H, K, S, D> {
  _type: 'list'
  _elements: E
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <$R extends RequiredOption = AtLeastOnce>(nextRequired?: $R) => List<E, $R, H, K, S, D>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => List<E, R, true, K, S, D>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => List<E, R, H, true, S, D>
  /**
   * Rename property before save commands
   */
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => List<E, R, H, K, $S, D>
  /**
   * Tag property as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => List<E, R, H, K, S, $D>
}
