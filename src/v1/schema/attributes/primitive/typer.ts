import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $defaults
} from '../constants/attributeOptions'
import { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $PrimitiveAttribute } from './interface'
import {
  PrimitiveAttributeOptions,
  PrimitiveAttributeDefaultOptions,
  PRIMITIVE_DEFAULT_OPTIONS
} from './options'
import type { PrimitiveAttributeType } from './types'

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
    putDefault: nextPutDefault =>
      primitive(type, {
        ...options,
        // TODO Fix options.defaults whose type seems badly inferred (update optional?)
        defaults: { update: options.defaults.update, put: nextPutDefault }
      }),
    updateDefault: nextUpdateDefault =>
      primitive(type, {
        ...options,
        // TODO Fix options.defaults whose type seems badly inferred (put optional?)
        defaults: { put: options.defaults.put, update: nextUpdateDefault }
      }),
    defaults: nextDefault =>
      primitive(type, { ...options, defaults: { put: nextDefault, update: nextDefault } }),
    enum: (...nextEnum) => primitive(type, { ...options, [$enum]: nextEnum }),
    const: constant =>
      primitive(type, {
        ...options,
        [$enum]: [constant],
        defaults: { put: constant, update: constant }
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
      ...primitiveOptions
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
