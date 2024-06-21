import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $PrimitiveAttribute } from './interface.js'
import {
  PRIMITIVE_DEFAULT_OPTIONS,
  PrimitiveAttributeDefaultOptions,
  PrimitiveAttributeOptions
} from './options.js'
import type { PrimitiveAttributeType } from './types.js'

type PrimitiveAttributeTyper<TYPE extends PrimitiveAttributeType> = <
  OPTIONS extends Partial<PrimitiveAttributeOptions> = PrimitiveAttributeOptions
>(
  primitiveOptions?: NarrowObject<OPTIONS>
) => $PrimitiveAttribute<
  TYPE,
  InferStateFromOptions<
    PrimitiveAttributeOptions,
    PrimitiveAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
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
    links: {
      ...PRIMITIVE_DEFAULT_OPTIONS.links,
      ...primitiveOptions.links
    },
    enum: undefined
  } as InferStateFromOptions<
    PrimitiveAttributeOptions,
    PrimitiveAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $PrimitiveAttribute(type, state)
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
