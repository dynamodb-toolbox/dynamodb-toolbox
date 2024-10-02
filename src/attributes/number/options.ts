import type { Transformer } from '~/transformers/index.js'

import type { AtLeastOnce, RequiredOption } from '../constants/requiredOptions.js'
import type { Validator } from '../types/validator.js'

// Note: May look like a duplicate of NumberAttributeState but actually adds JSDocs

/**
 * Input options of Number Attribute
 */
export type NumberAttributeOptions = {
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
   * Tag attribute as needed for Primary Key computing
   */
  key: boolean
  /**
   * Rename attribute before save commands
   */
  savedAs: string | undefined
  /**
   * Allow BigInts
   */
  big: boolean
  transform: undefined | Transformer<number | bigint>
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

export type NumberAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  big: false
  transform: undefined
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

export const NUMBER_DEFAULT_OPTIONS: NumberAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  transform: undefined,
  big: false,
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
