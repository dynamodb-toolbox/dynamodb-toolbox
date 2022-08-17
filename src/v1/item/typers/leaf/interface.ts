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

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Leaf property interface
 */
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
  /**
   * Tag a property as required. Possible values are:
   * - `AtLeastOnce` _(default)_: Required in PUTs, optional in UPDATEs
   * - `Never`: Optional in PUTs and UPDATEs
   * - `Always`: Required in PUTs and UPDATEs
   * - `OnlyOnce` (default): Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => Leaf<T, $R, H, K, S, E, D>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Leaf<T, R, true, K, S, E, D>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Leaf<T, R, H, true, S, E, D>
  /**
   * Rename property before save commands
   */
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Leaf<T, R, H, K, $S, E, D>
  /**
   * Provide a finite list of possible values for property
   * (For typing reasons, enums are only available as property methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <$E extends ResolveLeafType<T>[]>(...nextEnum: $E) => Leaf<T, R, H, K, S, $E, D & $E>
  /**
   * Provide a default value for property, or tag property as having a computed default value
   *
   * @param nextDefaultValue `Property type`, `() => Property type`, `ComputedDefault`
   */
  default: <
    $D extends LeafDefaultValue<T> &
      (E extends ResolveLeafType<T>[] ? E[number] | (() => E[number]) : unknown)
  >(
    nextDefaultValue: $D
  ) => Leaf<T, R, H, K, S, E, $D>
}
