import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of List Property
 */
export interface ListOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
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
   * Tag property as having a computed default value
   */
  default: D
}

export const listDefaultOptions: ListOptions<Never, false, false, undefined, undefined> = {
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
