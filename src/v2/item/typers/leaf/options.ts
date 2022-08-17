import { RequiredOption, Never } from '../constants/requiredOptions'

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
> {
  /**
   * Tag a property as required. Possible values are:
   * - `AtLeastOnce` _(default)_: Required in PUTs, optional in UPDATEs
   * - `Never`: Optional in PUTs and UPDATEs
   * - `Always`: Required in PUTs and UPDATEs
   * - `OnlyOnce` (default): Required in PUTs, denied in UPDATEs
   */
  required: R
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: H
  /**
   * Tag property as needed for Primary Key computing
   */
  key: K
  /**
   * Rename property before save commands
   */
  savedAs: S
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
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  _enum: undefined,
  default: undefined
}
