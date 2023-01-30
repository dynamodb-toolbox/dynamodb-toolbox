import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { _ListAttributeElements } from './types'
import type { _ListAttribute } from './interface'
import { ListAttributeOptions, ListAttributeDefaultOptions, LIST_DEFAULT_OPTIONS } from './options'

type ListAttributeTyper = <
  ELEMENTS extends _ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => _ListAttribute<
  { [$elements]: ELEMENTS } & InferStateFromOptions<
    ListAttributeOptions,
    ListAttributeDefaultOptions,
    OPTIONS
  >
>

/**
 * Define a new list attribute
 * Not that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Doesn't have a default value (default: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const list: ListAttributeTyper = <
  ELEMENTS extends _ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = { ...LIST_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'list',
    [$elements]: elements,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => list(elements, { ...appliedOptions, required: nextRequired }),
    optional: () => list(elements, { ...appliedOptions, required: 'never' }),
    hidden: () => list(elements, { ...appliedOptions, hidden: true }),
    key: () => list(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => list(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => list(elements, { ...appliedOptions, default: nextDefault })
  } as _ListAttribute<
    { [$elements]: ELEMENTS } & InferStateFromOptions<
      ListAttributeOptions,
      ListAttributeDefaultOptions,
      OPTIONS
    >
  >
}
