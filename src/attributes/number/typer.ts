import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $NumberAttribute } from './interface.js'
import { NUMBER_DEFAULT_OPTIONS } from './options.js'
import type { NumberAttributeDefaultOptions, NumberAttributeOptions } from './options.js'

type NumberAttributeTyper = <
  OPTIONS extends Partial<NumberAttributeOptions> = NumberAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => $NumberAttribute<
  InferStateFromOptions<
    NumberAttributeOptions,
    NumberAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >
>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Attribute Options
 */
export const number: NumberAttributeTyper = <
  OPTIONS extends Partial<NumberAttributeOptions> = NumberAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...NUMBER_DEFAULT_OPTIONS,
    ...options,
    enum: undefined,
    defaults: { ...NUMBER_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...NUMBER_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    NumberAttributeOptions,
    NumberAttributeDefaultOptions,
    OPTIONS,
    { enum: undefined }
  >

  return new $NumberAttribute(state)
}
