import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { Leaf } from './interface'
import { LeafOptions, LEAF_DEFAULT_OPTIONS } from './options'
import type { LeafType, EnumValues, LeafDefaultValue } from './types'

/**
 * Define a new "leaf" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Leaf Options
 */
const leaf = <
  Type extends LeafType = LeafType,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Enum extends EnumValues<Type> = EnumValues<Type>,
  Default extends LeafDefaultValue<Type> = LeafDefaultValue<Type>
>(
  options: { type: Type } & LeafOptions<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
): Leaf<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default> => {
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
  } as Leaf<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>
}

type LeafTyper<Type extends LeafType> = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Enum extends EnumValues<Type> = undefined,
  Default extends LeafDefaultValue<Type> = undefined
>(
  options?: O.Partial<LeafOptions<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>>
) => Leaf<Type, IsRequired, IsHidden, IsKey, SavedAs, Enum, Default>

const getLeafTyper = <Type extends LeafType>(type: Type) =>
  (<
    Required extends RequiredOption = Never,
    Hidden extends boolean = false,
    Key extends boolean = false,
    SavedAs extends string | undefined = undefined,
    Enum extends EnumValues<Type> = undefined,
    Default extends LeafDefaultValue<Type> = undefined
  >(
    leafOptions?: O.Partial<LeafOptions<Type, Required, Hidden, Key, SavedAs, Enum, Default>>
  ) => leaf({ ...LEAF_DEFAULT_OPTIONS, ...leafOptions, type })) as LeafTyper<Type>

/**
 * Define a new string attribute
 *
 * @param options _(optional)_ String Options
 */
export const string = getLeafTyper('string')

/**
 * Define a new number attribute
 *
 * @param options _(optional)_ Number Options
 */
export const number = getLeafTyper('number')

/**
 * Define a new binary attribute
 *
 * @param options _(optional)_ Binary Options
 */
export const binary = getLeafTyper('binary')

/**
 * Define a new boolean attribute
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean = getLeafTyper('boolean')
