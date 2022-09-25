import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AttributeState } from '../attribute/interface'
import type { LeafType, ResolveLeafType, EnumValues, LeafDefaultValue } from './types'

interface LeafState<
  Type extends LeafType = LeafType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> extends AttributeState<IsRequired, IsHidden, IsKey, SavedAs> {
  _enum: Enum
  _default: Default
}

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Leaf attribute interface
 */
export type Leaf<
  Type extends LeafType = LeafType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
> = LeafState<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default> & {
  _type: Type
  _resolved?: Enum extends ResolveLeafType<Type>[] ? Enum[number] : ResolveLeafType<Type>
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextIsRequired
  ) => Leaf<Type, NextIsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => Leaf<Type, IsRequired, true, IsKey, SavedAs, Enum, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => Leaf<Type, IsRequired, IsHidden, true, SavedAs, Enum, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Leaf<Type, IsRequired, IsHidden, IsKey, NextSavedAs, Enum, Default>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NextEnum extends ResolveLeafType<Type>[]>(
    ...nextEnum: NextEnum
  ) => Leaf<Type, IsRequired, IsHidden, IsKey, SavedAs, NextEnum, Default & NextEnum>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NextDefault extends LeafDefaultValue<Type> &
      (Enum extends ResolveLeafType<Type>[] ? Enum[number] | (() => Enum[number]) : unknown)
  >(
    nextDefaultValue: NextDefault
  ) => Leaf<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, NextDefault>
}
