import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { ListProperty } from './types'

interface ListState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

export interface List<
  E extends ListProperty = ListProperty,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends ListState<R, H, K, S, D> {
  _type: 'list'
  _elements: E
  required: <$R extends RequiredOption = AtLeastOnce>(nextRequired?: $R) => List<E, $R, H, K, S, D>
  hidden: () => List<E, R, true, K, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => List<E, R, H, K, $S, D>
  key: () => List<E, R, H, true, S, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => List<E, R, H, K, S, $D>
}
