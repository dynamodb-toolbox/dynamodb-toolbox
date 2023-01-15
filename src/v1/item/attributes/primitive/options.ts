import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type {
  PrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

/**
 * Input options of Primitive Attribute
 */
export interface PrimitiveAttributeOptions<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends PrimitiveAttributeEnumValues<TYPE> = PrimitiveAttributeEnumValues<TYPE>,
  DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = PrimitiveAttributeDefaultValue<TYPE>
> extends AttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  _enum: ENUM
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: DEFAULT
}

export const LEAF_DEFAULT_OPTIONS: PrimitiveAttributeOptions<
  PrimitiveAttributeType,
  AtLeastOnce,
  false,
  false,
  undefined,
  undefined,
  undefined
> = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  _enum: undefined,
  default: undefined
}
