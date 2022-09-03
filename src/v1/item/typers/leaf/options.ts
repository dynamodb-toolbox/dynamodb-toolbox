import type { PropertyOptions } from '../property/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafType, EnumValues, LeafDefaultValue } from './types'

/**
 * Input options of Leaf Property
 */
export interface LeafOptions<
  T extends LeafType = LeafType,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> extends PropertyOptions<R, H, K, S> {
  _enum: E
  /**
   * Provide a default value for property, or tag property as having a computed default value
   */
  default: D
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
