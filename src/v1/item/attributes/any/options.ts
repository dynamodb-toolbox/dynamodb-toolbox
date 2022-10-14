import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyAttributeDefaultValue } from './types'

/**
 * Input options of Any Attribute
 */
export interface AnyAttributeOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends AttributeOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: Default
}

export const ANY_DEFAULT_OPTIONS: AnyAttributeOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
