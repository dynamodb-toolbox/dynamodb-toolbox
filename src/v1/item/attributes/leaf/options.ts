import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafAttributeType, LeafAttributeEnumValues, LeafAttributeDefaultValue } from './types'

/**
 * Input options of Leaf Attribute
 */
export interface LeafAttributeOptions<
  TYPE extends LeafAttributeType = LeafAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends LeafAttributeEnumValues<TYPE> = LeafAttributeEnumValues<TYPE>,
  DEFAULT extends LeafAttributeDefaultValue<TYPE> = LeafAttributeDefaultValue<TYPE>
> extends AttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  _enum: ENUM
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: DEFAULT
}

export const LEAF_DEFAULT_OPTIONS: LeafAttributeOptions<
  LeafAttributeType,
  Never,
  false,
  false,
  undefined,
  undefined,
  undefined
> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  _enum: undefined,
  default: undefined
}
