import type { PropertyOptions } from '../property/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafType, EnumValues, LeafDefaultValue } from './types'

/**
 * Input options of Leaf Property
 */
export interface LeafOptions<
  Type extends LeafType = LeafType,
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> extends PropertyOptions<Required, Hidden, Key, SavedAs> {
  _enum: Enum
  /**
   * Provide a default value for property, or tag property as having a computed default value
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
