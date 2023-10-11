import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants'
import type { $MapAttributeAttributes, $Narrow } from '../types'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $MapAttribute } from './interface'
import { MapAttributeOptions, MapAttributeDefaultOptions, MAP_DEFAULT_OPTIONS } from './options'

type MapAttributeTyper = <
  ATTRIBUTES extends $MapAttributeAttributes,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeOptions
>(
  attributes: $Narrow<ATTRIBUTES>,
  options?: NarrowObject<OPTIONS>
) => $MapAttribute<
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
  ATTRIBUTES extends $MapAttributeAttributes,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeOptions
>(
  attributes: $Narrow<ATTRIBUTES>,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = {
    ...MAP_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...MAP_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  }

  return {
    [$type]: 'map',
    [$attributes]: attributes,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$defaults]: appliedOptions.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = ('atLeastOnce' as unknown) as NEXT_IS_REQUIRED
    ) => map(attributes, { ...appliedOptions, required: nextRequired }),
    optional: () => map(attributes, { ...appliedOptions, required: 'never' }),
    hidden: () => map(attributes, { ...appliedOptions, hidden: true }),
    key: () => map(attributes, { ...appliedOptions, key: true, required: 'always' }),
    savedAs: nextSavedAs => map(attributes, { ...appliedOptions, savedAs: nextSavedAs }),
    keyDefault: nextKeyDefault =>
      map(attributes, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, key: nextKeyDefault }
      }),
    putDefault: nextPutDefault =>
      map(attributes, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, put: nextPutDefault }
      }),
    updateDefault: nextUpdateDefault =>
      map(attributes, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, update: nextUpdateDefault }
      }),
    default: nextDefault =>
      map(attributes, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, [appliedOptions.key ? 'key' : 'put']: nextDefault }
      })
  } as $MapAttribute<
    ATTRIBUTES,
    InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>
  >
}
