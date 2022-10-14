import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafAttributeType, LeafAttributeEnumValues, LeafAttributeDefaultValue } from './types'

/**
 * Input options of Leaf Attribute
 */
export interface LeafAttributeOptions<
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
> extends AttributeOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  _enum: Enum
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: Default
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
