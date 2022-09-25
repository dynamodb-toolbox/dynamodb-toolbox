import { RequiredOption } from '../constants/requiredOptions'

/**
 * Common input options of all Attributes
 */
export interface AttributeOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined
> {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: IsRequired
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: IsHidden
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: IsKey
  /**
   * Rename attribute before save commands
   */
  savedAs: SavedAs
}
