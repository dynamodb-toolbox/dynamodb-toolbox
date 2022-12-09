import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { _PrimitiveAttribute } from './interface'
import { PrimitiveAttributeOptions, LEAF_DEFAULT_OPTIONS } from './options'
import type {
  PrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

/**
 * Define a new "primitive" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Primitive Options
 */
const primitive = <
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  ENUM extends PrimitiveAttributeEnumValues<TYPE> = PrimitiveAttributeEnumValues<TYPE>,
  DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = PrimitiveAttributeDefaultValue<TYPE>
>(
  options: { type: TYPE } & PrimitiveAttributeOptions<
    TYPE,
    IS_REQUIRED,
    IS_HIDDEN,
    IS_KEY,
    SAVED_AS,
    ENUM,
    DEFAULT
  >
): _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT> => {
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
    ) => primitive({ ...options, required: nextRequired }),
    hidden: () => primitive({ ...options, hidden: true }),
    key: () => primitive({ ...options, key: true }),
    savedAs: nextSavedAs => primitive({ ...options, savedAs: nextSavedAs }),
    default: nextDefault => primitive({ ...options, default: nextDefault }),
    enum: (...nextEnum) => primitive({ ...options, _enum: nextEnum })
  } as _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
}

type PrimitiveAttributeTyper<TYPE extends PrimitiveAttributeType> = <
  IS_REQUIRED extends RequiredOption = Never,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  ENUM extends PrimitiveAttributeEnumValues<TYPE> = undefined,
  DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = undefined
>(
  options?: O.Partial<
    PrimitiveAttributeOptions<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>
  >
) => _PrimitiveAttribute<TYPE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, ENUM, DEFAULT>

const getPrimitiveAttributeTyper = <TYPE extends PrimitiveAttributeType>(type: TYPE) =>
  (<
    REQUIRED extends RequiredOption = Never,
    HIDDEN extends boolean = false,
    KEY extends boolean = false,
    SAVED_AS extends string | undefined = undefined,
    ENUM extends PrimitiveAttributeEnumValues<TYPE> = undefined,
    DEFAULT extends PrimitiveAttributeDefaultValue<TYPE> = undefined
  >(
    primitiveOptions?: O.Partial<
      PrimitiveAttributeOptions<TYPE, REQUIRED, HIDDEN, KEY, SAVED_AS, ENUM, DEFAULT>
    >
  ) =>
    primitive({
      ...LEAF_DEFAULT_OPTIONS,
      ...primitiveOptions,
      type
    })) as PrimitiveAttributeTyper<TYPE>

/**
 * Define a new string attribute
 *
 * @param options _(optional)_ String Options
 */
export const string = getPrimitiveAttributeTyper('string')

/**
 * Define a new number attribute
 *
 * @param options _(optional)_ Number Options
 */
export const number = getPrimitiveAttributeTyper('number')

/**
 * Define a new binary attribute
 *
 * @param options _(optional)_ Binary Options
 */
export const binary = getPrimitiveAttributeTyper('binary')

/**
 * Define a new boolean attribute
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean = getPrimitiveAttributeTyper('boolean')