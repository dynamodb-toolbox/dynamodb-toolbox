import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { _LeafAttribute } from './interface'
import { LeafAttributeOptions, LEAF_DEFAULT_OPTIONS } from './options'
import type { LeafAttributeType, LeafAttributeEnumValues, LeafAttributeDefaultValue } from './types'

/**
 * Define a new "leaf" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Leaf Options
 */
const leaf = <
  TYPE extends LeafAttributeType = LeafAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends LeafAttributeEnumValues<TYPE> = LeafAttributeEnumValues<TYPE>,
  DEFAULT extends LeafAttributeDefaultValue<TYPE> = LeafAttributeDefaultValue<TYPE>
>(
  options: { type: TYPE } & LeafAttributeOptions<
    TYPE,
    IS_REQUIRED,
    IS_HIDDEN,
    IS_KEY,
    SAVED_AS,
    ENUM,
    DEFAULT
  >
): _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT> => {
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
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired = 'atLeastOnce' as NEXT_REQUIRED
    ) => leaf({ ...options, required: nextRequired }),
    hidden: () => leaf({ ...options, hidden: true }),
    key: () => leaf({ ...options, key: true }),
    savedAs: nextSavedAs => leaf({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => leaf({ ...options, default: nextDefault }),
    enum: (...nextEnum) => leaf({ ...options, _enum: nextEnum })
  } as _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
}

type LeafAttributeTyper<TYPE extends LeafAttributeType> = <
  IS_REQUIRED extends RequiredOption = Never,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  ENUM extends LeafAttributeEnumValues<TYPE> = undefined,
  DEFAULT extends LeafAttributeDefaultValue<TYPE> = undefined
>(
  options?: O.Partial<
    LeafAttributeOptions<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  >
) => _LeafAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>

const getLeafAttributeTyper = <TYPE extends LeafAttributeType>(type: TYPE) =>
  (<
    REQUIRED extends RequiredOption = Never,
    HIDDEN extends boolean = false,
    KEY extends boolean = false,
    SAVED_AS extends string | undefined = undefined,
    ENUM extends LeafAttributeEnumValues<TYPE> = undefined,
    DEFAULT extends LeafAttributeDefaultValue<TYPE> = undefined
  >(
    leafOptions?: O.Partial<
      LeafAttributeOptions<TYPE, REQUIRED, HIDDEN, KEY, SAVED_AS, ENUM, DEFAULT>
    >
  ) => leaf({ ...LEAF_DEFAULT_OPTIONS, ...leafOptions, type })) as LeafAttributeTyper<TYPE>

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
