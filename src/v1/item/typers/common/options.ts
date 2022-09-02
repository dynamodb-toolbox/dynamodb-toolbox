import { RequiredOption } from '../constants/requiredOptions'

/**
 * Common input options of all Properties
 */
export interface CommonOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined
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
}
