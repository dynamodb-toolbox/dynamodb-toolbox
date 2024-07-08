import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $MapAttribute } from './interface.js'
import { MAP_DEFAULT_OPTIONS } from './options.js'
import type { MapAttributeDefaultOptions, MapAttributeOptions } from './options.js'
import type { $MapAttributeAttributeStates } from './types.js'

type MapAttributeTyper = <
  ATTRIBUTES extends $MapAttributeAttributeStates,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeDefaultOptions
>(
  attributes: NarrowObject<ATTRIBUTES>,
  options?: NarrowObject<OPTIONS>
) => $MapAttribute<
  InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>,
  ATTRIBUTES
>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param options _(optional)_ Map Options
 */
export const map: MapAttributeTyper = <
  ATTRIBUTES extends $MapAttributeAttributeStates,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeDefaultOptions
>(
  attributes: NarrowObject<ATTRIBUTES>,
  options?: OPTIONS
): $MapAttribute<
  InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>,
  ATTRIBUTES
> => {
  const state = {
    ...MAP_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...MAP_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...MAP_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>

  return new $MapAttribute(state, attributes)
}
