import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $BinaryAttribute } from './interface.js'
import { BINARY_DEFAULT_OPTIONS } from './options.js'
import type { BinaryAttributeDefaultOptions, BinaryAttributeOptions } from './options.js'

type BinaryAttributeTyper = <
  OPTIONS extends Partial<BinaryAttributeOptions> = BinaryAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => $BinaryAttribute<
  InferStateFromOptions<
    BinaryAttributeOptions,
    BinaryAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
>

/**
 * Define a new attribute of binary type
 *
 * @param options _(optional)_ Attribute Options
 */
export const binary: BinaryAttributeTyper = <
  OPTIONS extends Partial<BinaryAttributeOptions> = BinaryAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...BINARY_DEFAULT_OPTIONS,
    ...options,
    enum: undefined,
    defaults: { ...BINARY_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...BINARY_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    BinaryAttributeOptions,
    BinaryAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $BinaryAttribute(state)
}
