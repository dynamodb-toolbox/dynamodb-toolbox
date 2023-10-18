import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $enum
} from '../constants/attributeOptions'

import type { $PrimitiveAttribute } from './interface'
import type { PrimitiveAttributeStateConstraint, PrimitiveAttributeType } from './types'
import {
  PrimitiveAttributeOptions,
  PrimitiveAttributeDefaultOptions,
  PRIMITIVE_DEFAULT_OPTIONS
} from './options'

type $PrimitiveAttributeTyper = <
  $TYPE extends PrimitiveAttributeType,
  STATE extends PrimitiveAttributeStateConstraint<$TYPE> = PrimitiveAttributeStateConstraint<$TYPE>
>(
  type: $TYPE,
  state: STATE
) => $PrimitiveAttribute<$TYPE, STATE>

/**
 * Define a new "primitive" attribute, i.e. string, number, binary or boolean
 *
 * @param options _(optional)_ Primitive Options
 */
const $primitive: $PrimitiveAttributeTyper = <
  $TYPE extends PrimitiveAttributeType,
  STATE extends PrimitiveAttributeStateConstraint<$TYPE> = PrimitiveAttributeStateConstraint<$TYPE>
>(
  type: $TYPE,
  state: STATE
) => {
  const $primitiveAttribute: $PrimitiveAttribute<$TYPE, STATE> = {
    [$type]: type,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    [$enum]: state.enum,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $primitive(type, overwrite(state, { required: nextRequired })),
    optional: () => $primitive(type, overwrite(state, { required: 'never' })),
    hidden: () => $primitive(type, overwrite(state, { hidden: true })),
    key: () => $primitive(type, overwrite(state, { key: true, required: 'always' })),
    savedAs: nextSavedAs => $primitive(type, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putDefault: nextPutDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault,
            update: state.defaults.update
          }
        })
      ),
    updateDefault: nextUpdateDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault
          }
        })
      ),
    default: nextDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putLink: nextPutDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault,
            update: state.defaults.update
          }
        })
      ),
    updateLink: nextUpdateDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault
          }
        })
      ),
    link: nextDefault =>
      $primitive(
        type,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    enum: (...nextEnum) => $primitive(type, overwrite(state, { enum: nextEnum })),
    const: constant =>
      $primitive(
        type,
        overwrite(state, {
          enum: [constant],
          defaults: state.key
            ? { key: constant, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: constant, update: state.defaults.update }
        })
      )
  }

  return $primitiveAttribute
}

type PrimitiveAttributeTyper<TYPE extends PrimitiveAttributeType> = <
  OPTIONS extends Partial<PrimitiveAttributeOptions> = PrimitiveAttributeOptions
>(
  primitiveOptions?: NarrowObject<OPTIONS>
) => $PrimitiveAttribute<
  TYPE,
  InferStateFromOptions<PrimitiveAttributeOptions, PrimitiveAttributeDefaultOptions, OPTIONS> & {
    enum: undefined
  }
>

type PrimitiveAttributeTyperFactory = <TYPE extends PrimitiveAttributeType>(
  type: TYPE
) => PrimitiveAttributeTyper<TYPE>

const primitiveAttributeTyperFactory: PrimitiveAttributeTyperFactory = <
  TYPE extends PrimitiveAttributeType
>(
  type: TYPE
) => <OPTIONS extends Partial<PrimitiveAttributeOptions> = PrimitiveAttributeOptions>(
  primitiveOptions = {} as NarrowObject<OPTIONS>
) => {
  const state = {
    ...PRIMITIVE_DEFAULT_OPTIONS,
    ...primitiveOptions,
    defaults: {
      ...PRIMITIVE_DEFAULT_OPTIONS.defaults,
      ...primitiveOptions.defaults
    },
    enum: undefined
  } as InferStateFromOptions<
    PrimitiveAttributeOptions,
    PrimitiveAttributeDefaultOptions,
    OPTIONS
  > & { enum: undefined }

  return $primitive(type, state)
}

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
