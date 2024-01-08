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
import type { SharedAttributeState } from '../shared/interface'

import type { $ListAttributeElements } from './types'
import type { $ListAttribute } from './interface'
import { ListAttributeOptions, ListAttributeDefaultOptions, LIST_DEFAULT_OPTIONS } from './options'
import { freezeListAttribute } from './freeze'

type $ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE
) => $ListAttribute<$ELEMENTS, STATE>

const $list: $ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE
) => {
  const $listAttribute: $ListAttribute<$ELEMENTS, STATE> = {
    [$type]: 'list',
    [$elements]: elements,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $list(elements, overwrite(state, { required: nextRequired })),
    optional: () => $list(elements, overwrite(state, { required: 'never' })),
    hidden: () => $list(elements, overwrite(state, { hidden: true })),
    key: () => $list(elements, overwrite(state, { key: true, required: 'always' })),
    savedAs: nextSavedAs => $list(elements, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $list(
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
      $list(
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
      $list(
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
      $list(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyDefault =>
      $list(
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
      $list(
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
      $list(
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
      $list(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    freeze: path => freezeListAttribute(elements, state, path)
  }

  return $listAttribute
}

type ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $ListAttribute<
  $ELEMENTS,
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
  $ELEMENTS extends $ListAttributeElements,
  OPTIONS extends Partial<ListAttributeOptions> = ListAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
): $ListAttribute<
  $ELEMENTS,
  InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>
> => {
  const state = {
    ...LIST_DEFAULT_OPTIONS,
    ...options,
    defaults: {
      ...LIST_DEFAULT_OPTIONS.defaults,
      ...options?.defaults
    }
  } as InferStateFromOptions<ListAttributeOptions, ListAttributeDefaultOptions, OPTIONS>

  return $list(elements, state)
}
