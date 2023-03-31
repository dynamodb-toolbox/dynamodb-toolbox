import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

// Note: May sound like a duplicate of AnyAttributeState but actually adds JSDocs

/**
 * Input options of MapAttribute Attribute
 */
export interface MapAttributeOptions {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   */
  required: RequiredOption
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: boolean
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: boolean
  /**
   * Rename attribute before save commands
   */
  savedAs: string | undefined
  /**
   * Tag attribute as having a computed default value
   */
  default: ComputedDefault | undefined
}

export type MapAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  default: undefined
}

export const MAP_DEFAULT_OPTIONS: MapAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}