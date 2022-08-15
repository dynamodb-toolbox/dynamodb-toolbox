import { RequiredOption, Never } from '../constants/requiredOptions'

import type { LeafType, EnumValues, LeafDefaultValue } from './types'

export interface LeafOptions<
  T extends LeafType = LeafType,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  _enum: E
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
