import { RequiredOption } from '../constants/requiredOptions'

/**
 * Common input options of all Attributes
 */
export interface AttributeOptions<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined
> {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: IS_REQUIRED
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: IS_HIDDEN
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: IS_KEY
  /**
   * Rename attribute before save commands
   */
  savedAs: SAVED_AS
}
