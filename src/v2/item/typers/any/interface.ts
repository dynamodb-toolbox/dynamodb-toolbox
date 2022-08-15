import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

interface _AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

export interface Any<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> extends _AnyOptions<R, H, K, S, D> {
  _type: 'any'
  required: <$R extends RequiredOption = AtLeastOnce>(nextRequired?: $R) => Any<$R, H, K, S, D>
  hidden: () => Any<R, true, K, S, D>
  key: () => Any<R, H, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Any<R, H, K, $S, D>
  default: <$D extends AnyDefaultValue>(nextDefaultValue: $D) => Any<R, H, K, S, $D>
}
