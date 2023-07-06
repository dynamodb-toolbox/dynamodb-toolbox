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

import type { $AnyOfAttribute } from './interface'
import {
  AnyOfAttributeOptions,
  AnyOfAttributeDefaultOptions,
  ANY_OF_DEFAULT_OPTIONS
} from './options'
import type { $AnyOfAttributeElements } from './types'

type AnyOfAttributeTyper = <
  ELEMENTS extends $AnyOfAttributeElements,
  OPTIONS extends Partial<AnyOfAttributeOptions> = AnyOfAttributeOptions
>(
  elements: ELEMENTS[],
  options?: NarrowObject<OPTIONS>
) => $AnyOfAttribute<
  ELEMENTS,
  InferStateFromOptions<AnyOfAttributeOptions, AnyOfAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new anyOf attribute
 * @param elements Attribute[]
 * @param options _(optional)_ AnyOf Options
 */
export const anyOf: AnyOfAttributeTyper = <
  ELEMENTS extends $AnyOfAttributeElements,
  OPTIONS extends Partial<AnyOfAttributeOptions> = AnyOfAttributeOptions
>(
  elements: ELEMENTS[],
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = {
    ...ANY_OF_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...ANY_OF_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  }

  return {
    [$type]: 'anyOf',
    [$elements]: elements,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$defaults]: appliedOptions.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => anyOf(elements, { ...appliedOptions, required: nextRequired }),
    optional: () => anyOf(elements, { ...appliedOptions, required: 'never' }),
    hidden: () => anyOf(elements, { ...appliedOptions, hidden: true }),
    key: () => anyOf(elements, { ...appliedOptions, key: true, required: 'always' }),
    savedAs: nextSavedAs => anyOf(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    keyDefault: nextKeyDefault =>
      anyOf(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, key: nextKeyDefault }
      }),
    putDefault: nextPutDefault =>
      anyOf(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, put: nextPutDefault }
      }),
    updateDefault: nextUpdateDefault =>
      anyOf(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, update: nextUpdateDefault }
      }),
    default: nextDefault =>
      anyOf(elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, [appliedOptions.key ? 'key' : 'put']: nextDefault }
      })
  } as $AnyOfAttribute<
    ELEMENTS,
    InferStateFromOptions<AnyOfAttributeOptions, AnyOfAttributeDefaultOptions, OPTIONS>
  >
}
