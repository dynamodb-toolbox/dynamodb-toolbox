import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $PrimitiveAttribute } from './interface.js'
import { PRIMITIVE_DEFAULT_OPTIONS } from './options.js'
import type { PrimitiveAttributeDefaultOptions, PrimitiveAttributeOptions } from './options.js'
import type { PrimitiveAttributeType } from './types.js'

export type PrimitiveAttributeTyper<TYPE extends PrimitiveAttributeType> = <
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

export const primitiveAttributeTyperFactory: PrimitiveAttributeTyperFactory =
  <TYPE extends PrimitiveAttributeType>(type: TYPE) =>
  <OPTIONS extends Partial<PrimitiveAttributeOptions> = PrimitiveAttributeOptions>(
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
      validators: {
        ...PRIMITIVE_DEFAULT_OPTIONS.validators,
        ...primitiveOptions.validators
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
