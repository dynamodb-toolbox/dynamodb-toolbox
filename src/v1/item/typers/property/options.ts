import { RequiredOption } from '../constants/requiredOptions'

/**
 * Common input options of all Properties
 */
export interface PropertyOptions<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: Required
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: Hidden
  /**
   * Tag property as needed for Primary Key computing
   */
  key: Key
  /**
   * Rename property before save commands
   */
  savedAs: SavedAs
}
