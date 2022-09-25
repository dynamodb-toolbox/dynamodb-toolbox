import { RequiredOption } from '../constants/requiredOptions'

/**
 * Common input options of all Properties
 */
export interface PropertyOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: IsRequired
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: IsHidden
  /**
   * Tag property as needed for Primary Key computing
   */
  key: IsKey
  /**
   * Rename property before save commands
   */
  savedAs: SavedAs
}
