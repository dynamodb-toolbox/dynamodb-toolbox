import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

import type { RequiredOption, AtLeastOnce } from '../constants'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import type { SharedAttributeState } from '../shared/interface'

import type { $MapAttribute } from './interface'
import type { $MapAttributeAttributeStates } from './types'
import { MapAttributeOptions, MapAttributeDefaultOptions, MAP_DEFAULT_OPTIONS } from './options'
import { freezeMapAttribute } from './freeze'

type $MapAttributeTyper = <
  $ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  attributes: NarrowObject<$ATTRIBUTES>,
  state: STATE
) => $MapAttribute<$ATTRIBUTES, STATE>

const $map: $MapAttributeTyper = <
  $ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  attributes: NarrowObject<$ATTRIBUTES>,
  state: STATE
) => {
  const $mapAttribute: $MapAttribute<$ATTRIBUTES, STATE> = {
    [$type]: 'map',
    [$attributes]: attributes,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    [$links]: state.links,
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_REQUIRED = ('atLeastOnce' as unknown) as NEXT_REQUIRED
    ) => $map(attributes, overwrite(state, { required: nextRequired })),
    optional: () => $map(attributes, overwrite(state, { required: 'never' as const })),
    hidden: <NEXT_HIDDEN extends boolean = true>(nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN) =>
      $map(attributes, overwrite(state, { hidden: nextHidden })),
    key: () =>
      $map(attributes, overwrite(state, { required: 'always' as const, key: true as const })),
    savedAs: nextSavedAs => $map(attributes, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $map(
        attributes,
        overwrite(state, {
          defaults: { key: nextKeyDefault, put: state.defaults.put, update: state.defaults.update }
        })
      ),
    putDefault: nextPutDefault =>
      $map(
        attributes,
        overwrite(state, {
          defaults: { key: state.defaults.key, put: nextPutDefault, update: state.defaults.update }
        })
      ),
    updateDefault: nextUpdateDefault =>
      $map(
        attributes,
        overwrite(state, {
          defaults: { key: state.defaults.key, put: state.defaults.put, update: nextUpdateDefault }
        })
      ),
    default: nextDefault =>
      $map(
        attributes,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyLink =>
      $map(
        attributes,
        overwrite(state, {
          links: { key: nextKeyLink, put: state.links.put, update: state.links.update }
        })
      ),
    putLink: nextPutLink =>
      $map(
        attributes,
        overwrite(state, {
          links: { key: state.links.key, put: nextPutLink, update: state.links.update }
        })
      ),
    updateLink: nextUpdateLink =>
      $map(
        attributes,
        overwrite(state, {
          links: { key: state.links.key, put: state.links.put, update: nextUpdateLink }
        })
      ),
    link: nextLink =>
      $map(
        attributes,
        overwrite(state, {
          links: state.key
            ? { key: nextLink, put: state.links.put, update: state.links.update }
            : { key: state.links.key, put: nextLink, update: state.links.update }
        })
      ),
    freeze: path => freezeMapAttribute(attributes, state, path)
  }

  return $mapAttribute
}

type MapAttributeTyper = <
  ATTRIBUTES extends $MapAttributeAttributeStates,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeDefaultOptions
>(
  attributes: NarrowObject<ATTRIBUTES>,
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
  ATTRIBUTES extends $MapAttributeAttributeStates,
  OPTIONS extends Partial<MapAttributeOptions> = MapAttributeDefaultOptions
>(
  attributes: NarrowObject<ATTRIBUTES>,
  options?: OPTIONS
): $MapAttribute<
  ATTRIBUTES,
  InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>
> => {
  const state = {
    ...MAP_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...MAP_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...MAP_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<MapAttributeOptions, MapAttributeDefaultOptions, OPTIONS>

  return $map(attributes, state)
}
