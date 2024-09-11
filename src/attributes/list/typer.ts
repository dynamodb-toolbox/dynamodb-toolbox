import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $ListAttribute } from './interface.js'
import { LIST_DEFAULT_OPTIONS } from './options.js'
import type { ListAttributeDefaultOptions, ListAttributeOptions } from './options.js'
import type { $ListAttributeElements } from './types.js'

type ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $ListAttribute<
  InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>,
  $ELEMENTS
>

/**
 * Define a new list attribute
 * Note that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const list: ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
): $ListAttribute<
  InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>,
  $ELEMENTS
> => {
  const state = {
    ...LIST_DEFAULT_OPTIONS,
    ...options,
    defaults: {
      ...LIST_DEFAULT_OPTIONS.defaults,
      ...options?.defaults
    },
    links: {
      ...LIST_DEFAULT_OPTIONS.links,
      ...options?.links
    },
    validators: {
      ...LIST_DEFAULT_OPTIONS.validators,
      ...options?.validators
    }
  } as InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>

  return new $ListAttribute(state, elements)
}
