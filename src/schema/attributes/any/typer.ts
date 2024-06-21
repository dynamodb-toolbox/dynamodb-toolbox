import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $AnyAttribute } from './interface.js'
import { ANY_DEFAULT_OPTIONS, AnyAttributeDefaultOptions, AnyAttributeOptions } from './options.js'

type AnyAttributeTyper = <OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions>(
  options?: NarrowObject<OPTIONS>
) => $AnyAttribute<
  InferStateFromOptions<
    AnyAttributeOptions,
    AnyAttributeDefaultOptions,
    OPTIONS,
    { castAs: unknown }
  >
>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Attribute Options
 */
export const any: AnyAttributeTyper = <
  OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...ANY_DEFAULT_OPTIONS,
    ...options,
    castAs: undefined,
    defaults: { ...ANY_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...ANY_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<
    AnyAttributeOptions,
    AnyAttributeDefaultOptions,
    OPTIONS,
    { castAs: unknown }
  >

  return new $AnyAttribute(state)
}
