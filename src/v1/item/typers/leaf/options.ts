import type { AttributeOptions } from '../attribute/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafType, EnumValues, LeafDefaultValue } from './types'

/**
 * Input options of Leaf Attribute
 */
export interface LeafOptions<
  Type extends LeafType = LeafType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> extends AttributeOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  _enum: Enum
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: Default
}

export const leafDefaultOptions: LeafOptions<
  LeafType,
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
