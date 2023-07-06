import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

// Note: May look like a duplicate of AnyAttributeState but actually adds JSDocs

/**
 * Input options of Record Attribute
 */
export interface RecordAttributeOptions {
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
   * Provide a default values for attribute
   */
  defaults: {
    key: ComputedDefault | undefined
    put: ComputedDefault | undefined
    update: ComputedDefault | undefined
  }
}

export type RecordAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export const RECORD_DEFAULT_OPTIONS: RecordAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  defaults: {
    key: undefined,
    put: undefined,
    update: undefined
  }
}
