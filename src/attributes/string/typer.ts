import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $StringAttribute } from './interface.js'
import { STRING_DEFAULT_OPTIONS } from './options.js'
import type { StringAttributeDefaultOptions, StringAttributeOptions } from './options.js'

type StringAttributeTyper = <
  OPTIONS extends Partial<StringAttributeOptions> = StringAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => $StringAttribute<
  InferStateFromOptions<
    StringAttributeOptions,
    StringAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Attribute Options
 */
export const string: StringAttributeTyper = <
  OPTIONS extends Partial<StringAttributeOptions> = StringAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...STRING_DEFAULT_OPTIONS,
    ...options,
    enum: undefined,
    defaults: { ...STRING_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...STRING_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    StringAttributeOptions,
    StringAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $StringAttribute(state)
}
