import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $ListAttributeElements } from './types'
import type { $ListAttribute } from './interface'
import { ListAttributeOptions, ListAttributeDefaultOptions, LIST_DEFAULT_OPTIONS } from './options'

type ListAttributeTyper = <
  ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $ListAttribute<
  ELEMENTS,
  InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new list attribute
 * Not that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const list: ListAttributeTyper = <
  ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = {
    ...LIST_DEFAULT_OPTIONS,
    ...options,
    defaults: {
      ...LIST_DEFAULT_OPTIONS.defaults,
      ...options?.defaults
    }
  }

  return {
    [$type]: 'list',
    [$elements]: elements,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$defaults]: appliedOptions.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => list(elements, { ...appliedOptions, required: nextRequired }),
    optional: () => list(elements, { ...appliedOptions, required: 'never' }),
    hidden: () => list(elements, { ...appliedOptions, hidden: true }),
    key: () => list(elements, { ...appliedOptions, key: true, required: 'always' }),
    savedAs: nextSavedAs => list(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    keyDefault: nextPutDefault =>
      list(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, key: nextPutDefault }
      }),
    putDefault: nextPutDefault =>
      list(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, put: nextPutDefault }
      }),
    updateDefault: nextUpdateDefault =>
      list(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, update: nextUpdateDefault }
      }),
    default: nextDefault =>
      list(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, [appliedOptions.key ? 'key' : 'put']: nextDefault }
      })
  } as $ListAttribute<
    ELEMENTS,
    InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>
  >
}
