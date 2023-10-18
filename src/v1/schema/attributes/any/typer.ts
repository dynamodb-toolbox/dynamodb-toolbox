import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { $type, $required, $hidden, $key, $savedAs, $defaults } from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import { SharedAttributeStateConstraint } from '../shared/interface'

import type { $AnyAttribute } from './interface'
import { AnyAttributeOptions, AnyAttributeDefaultOptions, ANY_DEFAULT_OPTIONS } from './options'
import { overwrite } from 'v1/utils/overwrite'

type $AnyAttributeTyper = <
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  state: STATE
) => $AnyAttribute<STATE>

const $any: $AnyAttributeTyper = <
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  state: STATE
) => {
  const $anyAttribute: $AnyAttribute<STATE> = {
    [$type]: 'any',
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $any(overwrite(state, { required: nextRequired })),
    optional: () => $any(overwrite(state, { required: 'never' })),
    hidden: () => $any(overwrite(state, { hidden: true })),
    key: () => $any(overwrite(state, { key: true, required: 'always' })),
    savedAs: nextSavedAs => $any(overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
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
            put: nextPutDefault,
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
            update: nextUpdateDefault
          }
        })
      ),
    default: nextDefault =>
      $any(
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: nextKeyDefault,
            put: state.defaults.put,
            update: state.defaults.update
          }
        })
      ),
    putLink: nextPutDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: nextPutDefault,
            update: state.defaults.update
          }
        })
      ),
    updateLink: nextUpdateDefault =>
      $any(
        overwrite(state, {
          defaults: {
            key: state.defaults.key,
            put: state.defaults.put,
            update: nextUpdateDefault
          }
        })
      ),
    link: nextDefault =>
      $any(
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      )
  }

  return $anyAttribute
}

type AnyAttributeTyper = <OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions>(
  options?: NarrowObject<OPTIONS>
) => $AnyAttribute<InferStateFromOptions<AnyAttributeOptions, AnyAttributeDefaultOptions, OPTIONS>>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Boolean Options
 */
export const any: AnyAttributeTyper = <
  OPTIONS extends Partial<AnyAttributeOptions> = AnyAttributeOptions
>(
  options?: NarrowObject<OPTIONS>
): $AnyAttribute<
  InferStateFromOptions<AnyAttributeOptions, AnyAttributeDefaultOptions, OPTIONS>
> => {
  const state = {
    ...ANY_DEFAULT_OPTIONS,
    ...options,
    defaults: { ...ANY_DEFAULT_OPTIONS.defaults, ...options?.defaults }
  } as InferStateFromOptions<AnyAttributeOptions, AnyAttributeDefaultOptions, OPTIONS>

  return $any(state)
}
