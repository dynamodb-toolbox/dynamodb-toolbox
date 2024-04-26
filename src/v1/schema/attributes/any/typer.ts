import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links,
  $castAs
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $AnyAttribute } from './interface'
import type { AnyAttributeState } from './types'
import { AnyAttributeOptions, AnyAttributeDefaultOptions, ANY_DEFAULT_OPTIONS } from './options'
import { freezeAnyAttribute } from './freeze'

type $AnyAttributeTyper = <STATE extends AnyAttributeState = AnyAttributeState>(
  state: STATE
) => $AnyAttribute<STATE>

const $any: $AnyAttributeTyper = <STATE extends AnyAttributeState = AnyAttributeState>(
  state: STATE
) => {
  const $anyAttribute: $AnyAttribute<STATE> = {
    [$type]: 'any',
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    [$links]: state.links,
    [$castAs]: state.castAs,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $any(overwrite(state, { required: nextRequired })),
    optional: () => $any(overwrite(state, { required: 'never' })),
    hidden: <NEXT_HIDDEN extends boolean = true>(nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN) =>
      $any(overwrite(state, { hidden: nextHidden })),
    key: <NEXT_KEY extends boolean = true>(nextKey: NEXT_KEY = true as NEXT_KEY) =>
      $any(overwrite(state, { key: nextKey, required: 'always' })),
    savedAs: nextSavedAs => $any(overwrite(state, { savedAs: nextSavedAs })),
    castAs: <NEXT_CAST_AS>(nextCastAs = (undefined as unknown) as NEXT_CAST_AS) =>
      $any(overwrite(state, { castAs: nextCastAs })),
    keyDefault: nextKeyDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: nextKeyDefault as unknown,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putDefault: nextPutDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault as unknown,
            update: state.defaults.update
          }
        })
      ),
    updateDefault: nextUpdateDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault as unknown
          }
        })
      ),
    default: nextDefault =>
      $any(
        overwrite(state, {
          defaults: state.key
            ? {
                key: nextDefault as unknown,
                put: state.defaults.put,
                update: state.defaults.update
              }
            : {
                key: state.defaults.key,
                put: nextDefault as unknown,
                update: state.defaults.update
              }
        })
      ),
    keyLink: nextKeyLink =>
      $any(
        overwrite(state, {
          links: {
            key: nextKeyLink as unknown,
            put: state.links.put,
            update: state.links.update
          }
        })
      ),
    putLink: nextPutLink =>
      $any(
        overwrite(state, {
          links: {
            key: state.links.key,
            put: nextPutLink as unknown,
            update: state.links.update
          }
        })
      ),
    updateLink: nextUpdateLink =>
      $any(
        overwrite(state, {
          links: {
            key: state.links.key,
            put: state.links.put,
            update: nextUpdateLink as unknown
          }
        })
      ),
    link: nextLink =>
      $any(
        overwrite(state, {
          links: state.key
            ? {
                key: nextLink as unknown,
                put: state.links.put,
                update: state.links.update
              }
            : {
                key: state.links.key,
                put: nextLink as unknown,
                update: state.links.update
              }
        })
      ),
    freeze: path => freezeAnyAttribute(state, path)
  }

  return $anyAttribute
}

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

  return $any(state)
}
