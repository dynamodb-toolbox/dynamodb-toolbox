import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { AttributeProperties, FrozenAttributeProperties } from '../shared/interface'
import type {
  LeafAttributeType,
  ResolveLeafAttributeType,
  LeafAttributeEnumValues,
  LeafAttributeDefaultValue
} from './types'

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Leaf attribute interface
 */
export type _LeafAttribute<
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
> = AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> & {
  _type: Type
  _resolved?: Enum extends ResolveLeafAttributeType<Type>[]
    ? Enum[number]
    : ResolveLeafAttributeType<Type>
  _enum: Enum
  _default: Default
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
  ) => _LeafAttribute<Type, NextIsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _LeafAttribute<Type, IsRequired, true, IsKey, SavedAs, Enum, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _LeafAttribute<Type, IsRequired, IsHidden, true, SavedAs, Enum, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => _LeafAttribute<Type, IsRequired, IsHidden, IsKey, NextSavedAs, Enum, Default>
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
  ) => _LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, NextEnum, Default & NextEnum>
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
  ) => _LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, NextDefault>
}

export type FrozenLeafAttribute<
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
> = FrozenAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> & {
  path: string
  type: Type
  resolved?: Enum extends ResolveLeafAttributeType<Type>[]
    ? Enum[number]
    : ResolveLeafAttributeType<Type>
  enum: Enum
  default: Default
}

export type FreezeLeafAttribute<Attribute extends _LeafAttribute> = FrozenLeafAttribute<
  Attribute['_type'],
  Attribute['_required'],
  Attribute['_hidden'],
  Attribute['_key'],
  Attribute['_savedAs'],
  Extract<Attribute['_enum'], LeafAttributeEnumValues<Attribute['_type']>>,
  Extract<Attribute['_default'], LeafAttributeDefaultValue<Attribute['_type']>>
>
