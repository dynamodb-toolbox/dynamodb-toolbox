import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

// Note: May sound like a duplicate of AnyAttributeState but actually adds JSDocs

/**
 * Input options of AnyOf Attribute
 */
export interface AnyOfAttributeOptions {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
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
   * Tag attribute as having computed default values
   */
  defaults: {
    put: ComputedDefault | undefined
    update: ComputedDefault | undefined
  }
}

export type AnyOfAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  defaults: {
    put: undefined
    update: undefined
  }
}

export const ANY_OF_DEFAULT_OPTIONS: AnyOfAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  defaults: {
    put: undefined,
    update: undefined
  }
}
