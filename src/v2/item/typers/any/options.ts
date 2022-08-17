import { RequiredOption, Never } from '../constants/requiredOptions'

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
   * - `AtLeastOnce` _(default)_: Required in PUTs, optional in UPDATEs
   * - `Never`: Optional in PUTs and UPDATEs
   * - `Always`: Required in PUTs and UPDATEs
   * - `OnlyOnce` (default): Required in PUTs, denied in UPDATEs
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
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
