import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
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
  TYPE extends LeafAttributeType = LeafAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends LeafAttributeEnumValues<TYPE> = LeafAttributeEnumValues<TYPE>,
  DEFAULT extends LeafAttributeDefaultValue<TYPE> = LeafAttributeDefaultValue<TYPE>
> = _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  _type: TYPE
  _resolved?: ENUM extends ResolveLeafAttributeType<TYPE>[]
    ? ENUM[number]
    : ResolveLeafAttributeType<TYPE>
  _enum: ENUM
  _default: DEFAULT
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => _LeafAttribute<TYPE, NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _LeafAttribute<TYPE, IS_REQUIRED, true, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, ENUM, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, ENUM, DEFAULT>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolveLeafAttributeType<TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ) => _LeafAttribute<
    TYPE,
    IS_REQUIRED,
    IS_HIDDEN,
    IS_KEY,
    SAVED_AS,
    NEXT_ENUM,
    DEFAULT & NEXT_ENUM
  >
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NEXT_DEFAULT extends LeafAttributeDefaultValue<TYPE> &
      (ENUM extends ResolveLeafAttributeType<TYPE>[]
        ? ENUM[number] | (() => ENUM[number])
        : unknown)
  >(
    nextDefaultValue: NEXT_DEFAULT
  ) => _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, NEXT_DEFAULT>
}

export type LeafAttribute<
  TYPE extends LeafAttributeType = LeafAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends LeafAttributeEnumValues<TYPE> = LeafAttributeEnumValues<TYPE>,
  DEFAULT extends LeafAttributeDefaultValue<TYPE> = LeafAttributeDefaultValue<TYPE>
> = AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  path: string
  type: TYPE
  resolved?: ENUM extends ResolveLeafAttributeType<TYPE>[]
    ? ENUM[number]
    : ResolveLeafAttributeType<TYPE>
  enum: ENUM
  default: DEFAULT
}

export type FreezeLeafAttribute<_LEAF_ATTRIBUTE extends _LeafAttribute> = LeafAttribute<
  _LEAF_ATTRIBUTE['_type'],
  _LEAF_ATTRIBUTE['_required'],
  _LEAF_ATTRIBUTE['_hidden'],
  _LEAF_ATTRIBUTE['_key'],
  _LEAF_ATTRIBUTE['_savedAs'],
  Extract<_LEAF_ATTRIBUTE['_enum'], LeafAttributeEnumValues<_LEAF_ATTRIBUTE['_type']>>,
  Extract<_LEAF_ATTRIBUTE['_default'], LeafAttributeDefaultValue<_LEAF_ATTRIBUTE['_type']>>
>
