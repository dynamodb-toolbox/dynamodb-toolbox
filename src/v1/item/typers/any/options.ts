import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

/**
 * Input options of Any Property
 */
export interface AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: R
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: H
  /**
   * Tag property as needed for Primary Key computing
   */
  key: K
  /**
   * Rename property before save commands
   */
  savedAs: S
  /**
   * Provide a default value for property, or tag property as having a computed default value
   */
  default: D
}

export const anyDefaultOptions: AnyOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
