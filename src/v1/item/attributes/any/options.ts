import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyAttributeDefaultValue } from './types'

/**
 * Input options of Any Attribute
 */
export interface AnyAttributeOptions<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends AttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: DEFAULT
}

export const ANY_DEFAULT_OPTIONS: AnyAttributeOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
