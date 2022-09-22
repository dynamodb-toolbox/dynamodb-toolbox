import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { PropertyState } from '../property/interface'
import type { LeafType, ResolveLeafType, EnumValues, LeafDefaultValue } from './types'

interface LeafState<
  Type extends LeafType = LeafType,
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> extends PropertyState<Required, Hidden, Key, SavedAs> {
  _enum: Enum
  _default: Default
}

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Leaf property interface
 */
export type Leaf<
  Type extends LeafType = LeafType,
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> = LeafState<Type, Required, Hidden, Key, SavedAs, Enum, Default> & {
  _type: Type
  _resolved?: Enum extends ResolveLeafType<Type>[] ? Enum[number] : ResolveLeafType<Type>
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => Leaf<Type, NextRequired, Hidden, Key, SavedAs, Enum, Default>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Leaf<Type, Required, true, Key, SavedAs, Enum, Default>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Leaf<Type, Required, Hidden, true, SavedAs, Enum, Default>
  /**
   * Rename property before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Leaf<Type, Required, Hidden, Key, NextSavedAs, Enum, Default>
  /**
   * Provide a finite list of possible values for property
   * (For typing reasons, enums are only available as property methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NextEnum extends ResolveLeafType<Type>[]>(
    ...nextEnum: NextEnum
  ) => Leaf<Type, Required, Hidden, Key, SavedAs, NextEnum, Default & NextEnum>
  /**
   * Provide a default value for property, or tag property as having a computed default value
   *
   * @param nextDefaultValue `Property type`, `() => Property type`, `ComputedDefault`
   */
  default: <
    NextDefault extends LeafDefaultValue<Type> &
      (Enum extends ResolveLeafType<Type>[] ? Enum[number] | (() => Enum[number]) : unknown)
  >(
    nextDefaultValue: NextDefault
  ) => Leaf<Type, Required, Hidden, Key, SavedAs, Enum, NextDefault>
}
