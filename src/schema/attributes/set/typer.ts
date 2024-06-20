import type { NarrowObject } from '~/types/narrowObject.js'
import { overwrite } from '~/utils/overwrite.js'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions.js'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import type { SharedAttributeState } from '../shared/interface.js'

import type { $SetAttribute } from './interface.js'
import type { $SetAttributeElements } from './types.js'
import {
  SetAttributeOptions,
  SetAttributeDefaultOptions,
  SET_ATTRIBUTE_DEFAULT_OPTIONS
} from './options.js'
import { freezeSetAttribute } from './freeze.js'

type $SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE
) => $SetAttribute<$ELEMENTS, STATE>

const $set: $SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE
) => {
  const $setAttribute: $SetAttribute<$ELEMENTS, STATE> = {
    [$type]: 'set',
    [$elements]: elements,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    [$links]: state.links,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $set(elements, overwrite(state, { required: nextRequired })),
    optional: () => $set(elements, overwrite(state, { required: 'never' })),
    hidden: <NEXT_HIDDEN extends boolean = true>(nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN) =>
      $set(elements, overwrite(state, { hidden: nextHidden })),
    key: <NEXT_KEY extends boolean = true>(nextKey: NEXT_KEY = true as NEXT_KEY) =>
      $set(elements, overwrite(state, { key: nextKey, required: 'always' })),
    savedAs: nextSavedAs => $set(elements, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $set(
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
      $set(
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
      $set(
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
      $set(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyLink =>
      $set(
        elements,
        overwrite(state, {
          links: {
            key: nextKeyLink,
            put: state.links.put,
            update: state.links.update
          }
        })
      ),
    putLink: nextPutLink =>
      $set(
        elements,
        overwrite(state, {
          links: {
            key: state.links.key,
            put: nextPutLink,
            update: state.links.update
          }
        })
      ),
    updateLink: nextUpdateLink =>
      $set(
        elements,
        overwrite(state, {
          links: {
            key: state.links.key,
            put: state.links.put,
            update: nextUpdateLink
          }
        })
      ),
    link: nextLink =>
      $set(
        elements,
        overwrite(state, {
          links: state.key
            ? { key: nextLink, put: state.links.put, update: state.links.update }
            : { key: state.links.key, put: nextLink, update: state.links.update }
        })
      ),
    freeze: path => freezeSetAttribute(elements, state, path)
  }

  return $setAttribute
}

type SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  OPTIONS extends Partial<SetAttributeOptions> = SetAttributeOptions
>(
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $SetAttribute<
  $ELEMENTS,
  InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new set attribute
 * Not that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ List Options
 */
export const set: SetAttributeTyper = <
  ELEMENTS extends $SetAttributeElements,
  OPTIONS extends Partial<SetAttributeOptions> = SetAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
): $SetAttribute<
  ELEMENTS,
  InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>
> => {
  const state = {
    ...SET_ATTRIBUTE_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...SET_ATTRIBUTE_DEFAULT_OPTIONS.defaults, ...options?.defaults },
    links: { ...SET_ATTRIBUTE_DEFAULT_OPTIONS.links, ...options?.links }
  } as InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>

  return $set(elements, state)
}
