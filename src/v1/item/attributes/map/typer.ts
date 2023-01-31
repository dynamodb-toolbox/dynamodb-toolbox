import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants'
import type { _MapAttributeAttributes, Narrow } from '../types'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { _MapAttribute } from './interface'
import { MapAttributeOptions, MapAttributeDefaultOptions, MAP_DEFAULT_OPTIONS } from './options'

type MapAttributeTyper = <
  ATTRIBUTES extends _MapAttributeAttributes,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeOptions
>(
  attributes: Narrow<ATTRIBUTES>,
  options?: NarrowObject<OPTIONS>
) => _MapAttribute<
  ATTRIBUTES,
  InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param options _(optional)_ Map Options
 */
export const map: MapAttributeTyper = <
  ATTRIBUTES extends _MapAttributeAttributes,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeOptions
>(
  attributes: Narrow<ATTRIBUTES>,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = { ...MAP_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'map',
    [$attributes]: attributes,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$open]: appliedOptions.open,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = ('atLeastOnce' as unknown) as NEXT_IS_REQUIRED
    ) => map(attributes, { ...appliedOptions, required: nextRequired }),
    optional: () => map(attributes, { ...appliedOptions, required: 'never' }),
    hidden: () => map(attributes, { ...appliedOptions, hidden: true }),
    key: () => map(attributes, { ...appliedOptions, key: true }),
    open: () => map(attributes, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(attributes, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(attributes, { ...appliedOptions, default: nextDefault })
  } as _MapAttribute<
    ATTRIBUTES,
    InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>
  >
}
