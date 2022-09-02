import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { Leaf } from './interface'
import { LeafOptions, leafDefaultOptions } from './options'
import type { LeafType, EnumValues, LeafDefaultValue } from './types'

/**
 * Define a new "leaf" property, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Leaf Options
 */
const leaf = <
  T extends LeafType = LeafType,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  E extends EnumValues<T> = EnumValues<T>,
  D extends LeafDefaultValue<T> = LeafDefaultValue<T>
>(
  options: { type: T } & LeafOptions<T, R, H, K, S, E, D>
): Leaf<T, R, H, K, S, E, D> => {
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
    required: <$R extends RequiredOption = AtLeastOnce>(nextRequired = 'atLeastOnce' as $R) =>
      leaf({ ...options, required: nextRequired }),
    hidden: () => leaf({ ...options, hidden: true }),
    key: () => leaf({ ...options, key: true }),
    savedAs: nextSavedAs => leaf({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => leaf({ ...options, default: nextDefault }),
    enum: (...nextEnum) => leaf({ ...options, _enum: nextEnum })
  } as Leaf<T, R, H, K, S, E, D>
}

type LeafTyper<T extends LeafType> = <
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  E extends EnumValues<T> = undefined,
  D extends LeafDefaultValue<T> = undefined
>(
  options?: O.Partial<LeafOptions<T, R, H, K, S, E, D>>
) => Leaf<T, R, H, K, S, E, D>

const getLeafTyper = <T extends LeafType>(type: T) =>
  (<
    R extends RequiredOption = Never,
    H extends boolean = false,
    K extends boolean = false,
    S extends string | undefined = undefined,
    D extends LeafDefaultValue<T> = undefined,
    E extends EnumValues<T> = undefined
  >(
    leafOptions?: O.Partial<LeafOptions<T, R, H, K, S, E, D>>
  ) => leaf({ ...leafDefaultOptions, ...leafOptions, type })) as LeafTyper<T>

/**
 * Define a new string property
 *
 * @param options _(optional)_ String Options
 */
export const string = getLeafTyper('string')

/**
 * Define a new number property
 *
 * @param options _(optional)_ Number Options
 */
export const number = getLeafTyper('number')

/**
 * Define a new binary property
 *
 * @param options _(optional)_ Binary Options
 */
export const binary = getLeafTyper('binary')

/**
 * Define a new boolean property
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean = getLeafTyper('boolean')
