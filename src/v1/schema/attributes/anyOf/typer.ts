import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

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
import type { SharedAttributeStateConstraint } from '../shared/interface'

import type { $AnyOfAttribute } from './interface'
import {
  AnyOfAttributeOptions,
  AnyOfAttributeDefaultOptions,
  ANY_OF_DEFAULT_OPTIONS
} from './options'
import type { $AnyOfAttributeElements } from './types'

type $AnyOfAttributeTyper = <
  $ELEMENTS extends $AnyOfAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  elements: $ELEMENTS[],
  state: STATE
) => $AnyOfAttribute<$ELEMENTS, STATE>

const $anyOf: $AnyOfAttributeTyper = <
  $ELEMENTS extends $AnyOfAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  elements: $ELEMENTS[],
  state: STATE
) => {
  const $anyOfAttribute: $AnyOfAttribute<$ELEMENTS, STATE> = {
    [$type]: 'anyOf',
    [$elements]: elements,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $anyOf(elements, overwrite(state, { required: nextRequired })),
    optional: () => $anyOf(elements, overwrite(state, { required: 'never' })),
    hidden: () => $anyOf(elements, overwrite(state, { hidden: true })),
    key: () => $anyOf(elements, overwrite(state, { key: true, required: 'always' })),
    savedAs: nextSavedAs => $anyOf(elements, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putDefault: nextPutDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault,
            update: state.defaults.update
          }
        })
      ),
    updateDefault: nextUpdateDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault
          }
        })
      ),
    default: nextDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putLink: nextPutDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault,
            update: state.defaults.update
          }
        })
      ),
    updateLink: nextUpdateDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault
          }
        })
      ),
    link: nextDefault =>
      $anyOf(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      )
  }

  return $anyOfAttribute
}

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
  $ELEMENTS extends $AnyOfAttributeElements,
  OPTIONS extends Partial<AnyOfAttributeOptions> = AnyOfAttributeOptions
>(
  elements: $ELEMENTS[],
  options?: NarrowObject<OPTIONS>
) => {
  const state = {
    ...ANY_OF_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...ANY_OF_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  } as InferStateFromOptions<AnyOfAttributeOptions, AnyOfAttributeDefaultOptions, OPTIONS>

  return $anyOf(elements, state)
}
