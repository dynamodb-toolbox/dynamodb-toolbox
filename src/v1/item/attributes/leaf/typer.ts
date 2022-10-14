import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { LeafAttribute } from './interface'
import { LeafAttributeOptions, LEAF_DEFAULT_OPTIONS } from './options'
import type { LeafAttributeType, LeafAttributeEnumValues, LeafAttributeDefaultValue } from './types'

/**
 * Define a new "leaf" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Leaf Options
 */
const leaf = <
  Type extends LeafAttributeType = LeafAttributeType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends LeafAttributeEnumValues<Type> = LeafAttributeEnumValues<Type>,
  Default extends LeafAttributeDefaultValue<Type> = LeafAttributeDefaultValue<Type>
>(
  options: { type: Type } & LeafAttributeOptions<
    Type,
    IsRequired,
    IsHidden,
    IsKey,
    SavedAs,
    Enum,
    Default
  >
): LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default> => {
  const {
    type: _type,
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default,
    _enum
  } = options

  return {
    _type,
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    _enum,
    required: <NextRequired extends RequiredOption = AtLeastOnce>(
      nextRequired = 'atLeastOnce' as NextRequired
    ) => leaf({ ...options, required: nextRequired }),
    hidden: () => leaf({ ...options, hidden: true }),
    key: () => leaf({ ...options, key: true }),
    savedAs: nextSavedAs => leaf({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => leaf({ ...options, default: nextDefault }),
    enum: (...nextEnum) => leaf({ ...options, _enum: nextEnum })
  } as LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
}

type LeafAttributeTyper<Type extends LeafAttributeType> = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Enum extends LeafAttributeEnumValues<Type> = undefined,
  Default extends LeafAttributeDefaultValue<Type> = undefined
>(
  options?: O.Partial<
    LeafAttributeOptions<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
  >
) => LeafAttribute<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>

const getLeafAttributeTyper = <Type extends LeafAttributeType>(type: Type) =>
  (<
    Required extends RequiredOption = Never,
    Hidden extends boolean = false,
    Key extends boolean = false,
    SavedAs extends string | undefined = undefined,
    Enum extends LeafAttributeEnumValues<Type> = undefined,
    Default extends LeafAttributeDefaultValue<Type> = undefined
  >(
    leafOptions?: O.Partial<
      LeafAttributeOptions<Type, Required, Hidden, Key, SavedAs, Enum, Default>
    >
  ) => leaf({ ...LEAF_DEFAULT_OPTIONS, ...leafOptions, type })) as LeafAttributeTyper<Type>

/**
 * Define a new string attribute
 *
 * @param options _(optional)_ String Options
 */
export const string = getLeafAttributeTyper('string')

/**
 * Define a new number attribute
 *
 * @param options _(optional)_ Number Options
 */
export const number = getLeafAttributeTyper('number')

/**
 * Define a new binary attribute
 *
 * @param options _(optional)_ Binary Options
 */
export const binary = getLeafAttributeTyper('binary')

/**
 * Define a new boolean attribute
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean = getLeafAttributeTyper('boolean')
