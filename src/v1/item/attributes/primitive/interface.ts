import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import {
  $type,
  $resolved,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $default
} from '../constants/symbols'

import type {
  PrimitiveAttributeType,
  ResolvePrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

// TODO: Define reqKey / optKey or partitionKey / sortKey shorthands ?
/**
 * Primitive attribute interface
 */
export type _PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends PrimitiveAttributeEnumValues<TYPE> = PrimitiveAttributeEnumValues<TYPE>,
  DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = PrimitiveAttributeDefaultValue<TYPE>
> = _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  [$type]: TYPE
  [$resolved]?: ENUM extends ResolvePrimitiveAttributeType<TYPE>[]
    ? ENUM[number]
    : ResolvePrimitiveAttributeType<TYPE>
  [$enum]: ENUM
  [$default]: DEFAULT
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
  ) => _PrimitiveAttribute<TYPE, NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _PrimitiveAttribute<TYPE, 'never', IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _PrimitiveAttribute<TYPE, IS_REQUIRED, true, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, ENUM, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, ENUM, DEFAULT>
  /**
   * Provide a finite list of possible values for attribute
   * (For typing reasons, enums are only available as attribute methods, not as input options)
   *
   * @param {Object[]} enum Possible values
   * @example
   * string().enum('foo', 'bar')
   */
  enum: <NEXT_ENUM extends ResolvePrimitiveAttributeType<TYPE>[]>(
    ...nextEnum: NEXT_ENUM
  ) => _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, NEXT_ENUM, DEFAULT>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <
    NEXT_DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> &
      (ENUM extends ResolvePrimitiveAttributeType<TYPE>[]
        ? ENUM[number] | (() => ENUM[number])
        : unknown)
  >(
    nextDefaultValue: NEXT_DEFAULT
  ) => _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, NEXT_DEFAULT>
}

export type PrimitiveAttribute<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends PrimitiveAttributeEnumValues<TYPE> = PrimitiveAttributeEnumValues<TYPE>,
  DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = PrimitiveAttributeDefaultValue<TYPE>
> = AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  path: string
  type: TYPE
  resolved?: ENUM extends ResolvePrimitiveAttributeType<TYPE>[]
    ? ENUM[number]
    : ResolvePrimitiveAttributeType<TYPE>
  enum: ENUM
  default: DEFAULT
}

export type FreezePrimitiveAttribute<
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
> = PrimitiveAttribute<
  _PRIMITIVE_ATTRIBUTE[$type],
  _PRIMITIVE_ATTRIBUTE[$required],
  _PRIMITIVE_ATTRIBUTE[$hidden],
  _PRIMITIVE_ATTRIBUTE[$key],
  _PRIMITIVE_ATTRIBUTE[$savedAs],
  Extract<_PRIMITIVE_ATTRIBUTE[$enum], PrimitiveAttributeEnumValues<_PRIMITIVE_ATTRIBUTE[$type]>>,
  Extract<
    _PRIMITIVE_ATTRIBUTE[$default],
    PrimitiveAttributeDefaultValue<_PRIMITIVE_ATTRIBUTE[$type]>
  >
>
