import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $defaults
} from '../constants/attributeOptions'

import type { $PrimitiveAttribute } from './interface'
import type { PrimitiveAttributeType } from './types'
import {
  PrimitiveAttributeOptions,
  PrimitiveAttributeDefaultOptions,
  PRIMITIVE_DEFAULT_OPTIONS
} from './options'

type AnyPrimitiveAttributeTyper = <
  TYPE extends PrimitiveAttributeType,
  OPTIONS extends PrimitiveAttributeOptions<TYPE> = PrimitiveAttributeOptions<TYPE>
>(
  type: TYPE,
  options: NarrowObject<OPTIONS>
) => $PrimitiveAttribute<
  TYPE,
  {
    required: OPTIONS['required']
    hidden: OPTIONS['hidden']
    key: OPTIONS['key']
    savedAs: OPTIONS['savedAs']
    enum: OPTIONS[$enum]
    defaults: OPTIONS['defaults']
  }
>

/**
 * Define a new "primitive" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Primitive Options
 */
const primitive: AnyPrimitiveAttributeTyper = <
  TYPE extends PrimitiveAttributeType,
  OPTIONS extends PrimitiveAttributeOptions<TYPE> = PrimitiveAttributeOptions<TYPE>
>(
  type: TYPE,
  options: NarrowObject<OPTIONS>
) =>
  ({
    [$type]: type,
    [$required]: options.required,
    [$hidden]: options.hidden,
    [$key]: options.key,
    [$savedAs]: options.savedAs,
    [$enum]: options[$enum],
    [$defaults]: options.defaults,
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired = 'atLeastOnce' as NEXT_REQUIRED
    ) => primitive(type, { ...options, required: nextRequired }),
    optional: () => primitive(type, { ...options, required: 'never' }),
    hidden: () => primitive(type, { ...options, hidden: true }),
    key: () => primitive(type, { ...options, key: true, required: 'always' }),
    savedAs: nextSavedAs => primitive(type, { ...options, savedAs: nextSavedAs }),
    keyDefault: nextKeyDefault =>
      primitive(type, {
        ...options,
        defaults: {
          // TODO Fix options.defaults whose type seems badly inferred (update optional?)
          key: nextKeyDefault,
          update: options.defaults.update,
          put: options.defaults.put
        }
      }),
    putDefault: nextPutDefault =>
      primitive(type, {
        ...options,
        defaults: {
          // TODO Fix options.defaults whose type seems badly inferred (update optional?)
          key: options.defaults.key,
          update: options.defaults.update,
          put: nextPutDefault
        }
      }),
    updateDefault: nextUpdateDefault =>
      primitive(type, {
        ...options,
        defaults: {
          // TODO Fix options.defaults whose type seems badly inferred (put optional?)
          key: options.defaults.key,
          put: options.defaults.put,
          update: nextUpdateDefault
        }
      }),
    default: nextDefault =>
      primitive(type, {
        ...options,
        defaults: {
          // TODO Fix options.defaults whose type seems badly inferred (put optional?)
          key: options.defaults.key,
          put: options.defaults.put,
          update: options.defaults.update,
          [options.key ? 'key' : 'put']: nextDefault
        }
      }),
    enum: (...nextEnum) => primitive(type, { ...options, [$enum]: nextEnum }),
    const: constant =>
      primitive(type, {
        ...options,
        [$enum]: [constant],
        defaults: {
          // TODO Fix options.defaults whose type seems badly inferred (put optional?)
          key: options.defaults.key,
          put: options.defaults.put,
          update: options.defaults.update,
          [options.key ? 'key' : 'put']: constant
        }
      })
  } as $PrimitiveAttribute<
    TYPE,
    {
      required: OPTIONS['required']
      hidden: OPTIONS['hidden']
      key: OPTIONS['key']
      savedAs: OPTIONS['savedAs']
      enum: OPTIONS[$enum]
      defaults: OPTIONS['defaults']
    }
  >)

type PrimitiveAttributeTyper<TYPE extends PrimitiveAttributeType> = <
  OPTIONS extends Partial<PrimitiveAttributeOptions<TYPE>> = PrimitiveAttributeOptions<TYPE>
>(
  primitiveOptions?: NarrowObject<OPTIONS>
) => $PrimitiveAttribute<
  TYPE,
  InferStateFromOptions<
    Omit<PrimitiveAttributeOptions<TYPE>, $enum> & { enum: PrimitiveAttributeOptions<TYPE>[$enum] },
    Omit<PrimitiveAttributeDefaultOptions, $enum> & {
      enum: PrimitiveAttributeDefaultOptions[$enum]
    },
    Omit<OPTIONS, $enum> & { enum: OPTIONS[$enum] }
  >
>

type PrimitiveAttributeTyperFactory = <TYPE extends PrimitiveAttributeType>(
  type: TYPE
) => PrimitiveAttributeTyper<TYPE>

const primitiveAttributeTyperFactory: PrimitiveAttributeTyperFactory = <
  TYPE extends PrimitiveAttributeType
>(
  type: TYPE
) =>
  (<OPTIONS extends Partial<PrimitiveAttributeOptions<TYPE>> = PrimitiveAttributeOptions<TYPE>>(
    primitiveOptions = {} as NarrowObject<OPTIONS>
  ) =>
    primitive(type, {
      ...PRIMITIVE_DEFAULT_OPTIONS,
      ...primitiveOptions,
      defaults: {
        ...PRIMITIVE_DEFAULT_OPTIONS.defaults,
        ...primitiveOptions.defaults
      }
    })) as PrimitiveAttributeTyper<TYPE>

/**
 * Define a new string attribute
 *
 * @param options _(optional)_ String Options
 */
export const string = primitiveAttributeTyperFactory('string')

/**
 * Define a new number attribute
 *
 * @param options _(optional)_ Number Options
 */
export const number = primitiveAttributeTyperFactory('number')

/**
 * Define a new binary attribute
 *
 * @param options _(optional)_ Binary Options
 */
export const binary = primitiveAttributeTyperFactory('binary')

/**
 * Define a new boolean attribute
 *
 * @param options _(optional)_ Boolean Options
 */
export const boolean = primitiveAttributeTyperFactory('boolean')
