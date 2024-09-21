import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $NullAttribute } from './interface.js'
import { NULL_DEFAULT_OPTIONS } from './options.js'
import type { NullAttributeDefaultOptions, NullAttributeOptions } from './options.js'

type NullAttributeTyper = <OPTIONS extends Partial<NullAttributeOptions> = NullAttributeOptions>(
  options?: NarrowObject<OPTIONS>
) => $NullAttribute<
  InferStateFromOptions<
    NullAttributeOptions,
    NullAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
>

/**
 * Define a new attribute of null type
 *
 * @param options _(optional)_ Attribute Options
 */
export const nul: NullAttributeTyper = <
  OPTIONS extends Partial<NullAttributeOptions> = NullAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...NULL_DEFAULT_OPTIONS,
    ...options,
    enum: undefined,
    defaults: { ...NULL_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...NULL_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    NullAttributeOptions,
    NullAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $NullAttribute(state)
}
