import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
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

import type { $SetAttribute } from './interface'
import type { $SetAttributeElements } from './types'
import {
  SetAttributeOptions,
  SetAttributeDefaultOptions,
  SET_ATTRIBUTE_DEFAULT_OPTIONS
} from './options'
import { freezeSetAttribute } from './freeze'

type $SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  elements: $ELEMENTS,
  state: STATE
) => $SetAttribute<$ELEMENTS, STATE>

const $set: $SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
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
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $set(elements, overwrite(state, { required: nextRequired })),
    optional: () => $set(elements, overwrite(state, { required: 'never' })),
    hidden: () => $set(elements, overwrite(state, { hidden: true })),
    key: () => $set(elements, overwrite(state, { key: true, required: 'always' })),
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
    keyLink: nextKeyDefault =>
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
    putLink: nextPutDefault =>
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
    updateLink: nextUpdateDefault =>
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
    link: nextDefault =>
      $set(
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
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
    defaults: { ...SET_ATTRIBUTE_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  } as InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>

  return $set(elements, state)
}
