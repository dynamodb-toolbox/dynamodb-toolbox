import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $SetAttribute } from './interface.js'
import { SET_DEFAULT_OPTIONS } from './options.js'
import type { SetAttributeDefaultOptions, SetAttributeOptions } from './options.js'
import type { $SetAttributeElements } from './types.js'

type SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  OPTIONS extends Partial<SetAttributeOptions> = SetAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $SetAttribute<
  InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>,
  $ELEMENTS
>

/**
 * Define a new set attribute
 * Not that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const set: SetAttributeTyper = <
  ELEMENTS extends $SetAttributeElements,
  OPTIONS extends Partial<SetAttributeOptions> = SetAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
): $SetAttribute<
  InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>,
  ELEMENTS
> => {
  const state = {
    ...SET_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...SET_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...SET_DEFAULT_OPTIONS.links, ...options?.links },
    validators: { ...SET_DEFAULT_OPTIONS.validators, ...options?.validators }
  } as InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>

  return new $SetAttribute(state, elements)
}
