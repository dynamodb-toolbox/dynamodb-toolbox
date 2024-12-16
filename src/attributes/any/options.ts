import type { AtLeastOnce, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'

// Note: May look like a duplicate of AnyAttributeState but actually adds JSDocs

export interface AnyAttributeOptions {
  /**
   * Tag attribute as required. Possible values are:
   * - `'atLeastOnce'` _(default)_: Required in PUTs, optional in UPDATEs
   * - `'never'`: Optional in PUTs and UPDATEs
   * - `'always'`: Required in PUTs and UPDATEs
   */
  required: RequiredOption
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: boolean
  /**
   * Tag attribute as a primary key attribute or linked to a primary attribute
   */
  key: boolean
  /**
   * Rename attribute before save commands
   */
  savedAs: string | undefined
  /**
   * Provide default values for attribute
   */
  defaults: {
    key: undefined | unknown
    put: undefined | unknown
    update: undefined | unknown
  }
  /**
   * Provide **linked** default values for attribute
   */
  links: {
    key: undefined | unknown
    put: undefined | unknown
    update: undefined | unknown
  }
  /**
   * Provide custom **validators** for attribute
   */
  validators: {
    key: undefined | Validator
    put: undefined | Validator
    update: undefined | Validator
  }
}

export type AnyAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  defaults: {
    key: undefined
    put: undefined
    update: undefined
  }
  links: {
    key: undefined
    put: undefined
    update: undefined
  }
  validators: {
    key: undefined
    put: undefined
    update: undefined
  }
}

export const ANY_DEFAULT_OPTIONS: AnyAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  defaults: {
    key: undefined,
    put: undefined,
    update: undefined
  },
  links: {
    key: undefined,
    put: undefined,
    update: undefined
  },
  validators: {
    key: undefined,
    put: undefined,
    update: undefined
  }
}
