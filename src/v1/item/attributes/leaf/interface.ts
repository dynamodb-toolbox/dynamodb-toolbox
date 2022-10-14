import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AttributeProperties } from '../shared/interface'
import type {
  LeafAttributeType,
  ResolveLeafAttributeType,
  LeafAttributeEnumValues,
  LeafAttributeDefaultValue
} from './types'

interface LeafAttributeProperties<
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _enum: Enum
  _default: Default
}

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Leaf attribute interface
 */
export type LeafAttribute<
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
> = LeafAttributeProperties<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default> & {
  _type: Type
  _resolved?: Enum extends ResolveLeafAttributeType<Type>[]
    ? Enum[number]
    : ResolveLeafAttributeType<Type>
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
  ) => LeafAttribute<Type, NextIsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => LeafAttribute<Type, IsRequired, true, IsKey, SavedAs, Enum, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => LeafAttribute<Type, IsRequired, IsHidden, true, SavedAs, Enum, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => LeafAttribute<Type, IsRequired, IsHidden, IsKey, NextSavedAs, Enum, Default>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NextEnum extends ResolveLeafAttributeType<Type>[]>(
    ...nextEnum: NextEnum
  ) => LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, NextEnum, Default & NextEnum>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NextDefault extends LeafAttributeDefaultValue<Type> &
      (Enum extends ResolveLeafAttributeType<Type>[]
        ? Enum[number] | (() => Enum[number])
        : unknown)
  >(
    nextDefaultValue: NextDefault
  ) => LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, NextDefault>
}
