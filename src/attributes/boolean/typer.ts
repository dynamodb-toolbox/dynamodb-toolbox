import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $BooleanAttribute } from './interface.js'
import { BOOLEAN_DEFAULT_OPTIONS } from './options.js'
import type { BooleanAttributeDefaultOptions, BooleanAttributeOptions } from './options.js'

type BooleanAttributeTyper = <
  OPTIONS extends Partial<BooleanAttributeOptions> = BooleanAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => $BooleanAttribute<
  InferStateFromOptions<
    BooleanAttributeOptions,
    BooleanAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
>

/**
 * Define a new attribute of boolean type
 *
 * @param options _(optional)_ Attribute Options
 */
export const boolean: BooleanAttributeTyper = <
  OPTIONS extends Partial<BooleanAttributeOptions> = BooleanAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...BOOLEAN_DEFAULT_OPTIONS,
    ...options,
    enum: undefined,
    defaults: { ...BOOLEAN_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...BOOLEAN_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    BooleanAttributeOptions,
    BooleanAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $BooleanAttribute(state)
}
