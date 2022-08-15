import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { LeafType, ResolveLeafType, EnumValues, LeafDefaultValue } from './types'

interface LeafState<
  T extends LeafType = LeafType,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _enum: E
  _default: D
}

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands

export type Leaf<
  T extends LeafType = LeafType,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
> = LeafState<T, R, H, K, S, E, D> & {
  _type: T
  _resolved?: E extends ResolveLeafType<T>[] ? E[number] : ResolveLeafType<T>
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => Leaf<T, $R, H, K, S, E, D>
  hidden: () => Leaf<T, R, true, K, S, E, D>
  key: () => Leaf<T, R, H, true, S, E, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Leaf<T, R, H, K, $S, E, D>
  enum: <$E extends ResolveLeafType<T>[]>(...nextEnum: $E) => Leaf<T, R, H, K, S, $E, D & $E>
  default: <
    $D extends LeafDefaultValue<T> &
      (E extends ResolveLeafType<T>[] ? E[number] | (() => E[number]) : unknown)
  >(
    nextDefaultValue: $D
  ) => Leaf<T, R, H, K, S, E, $D>
}
