import type { RequiredOption } from '../constants/requiredOptions'
import type { ResolvedAttribute } from '../types'

import type { ConstantAttributeDefaultValue } from './types'

// Note: May sound like a duplicate of AnyAttributeState but actually adds JSDocs

/**
 * Input options of Const Attribute
 */
export interface ConstantAttributeOptions<VALUE extends ResolvedAttribute = ResolvedAttribute> {
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
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: ConstantAttributeDefaultValue<VALUE>
}

export type ConstantAttributeDefaultOptions = {
  required: 'atLeastOnce'
  hidden: false
  key: false
  savedAs: undefined
  default: undefined
}

export const CONSTANT_DEFAULT_OPTIONS: ConstantAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
