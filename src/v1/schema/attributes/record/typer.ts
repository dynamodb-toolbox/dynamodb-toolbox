import type { NarrowObject } from 'v1/types/narrowObject'
import { overwrite } from 'v1/utils/overwrite'

import type { RequiredOption, AtLeastOnce } from '../constants'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import type { SharedAttributeStateConstraint } from '../shared/interface'

import type { $RecordAttributeKeys, $RecordAttributeElements } from './types'
import type { $RecordAttribute } from './interface'
import {
  RecordAttributeOptions,
  RecordAttributeDefaultOptions,
  RECORD_DEFAULT_OPTIONS
} from './options'
import { freezeRecordAttribute } from './freeze'

type $RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: STATE
) => $RecordAttribute<$KEYS, $ELEMENTS, STATE>

const $record: $RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeStateConstraint = SharedAttributeStateConstraint
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: STATE
) => {
  const $recordAttribute: $RecordAttribute<$KEYS, $ELEMENTS, STATE> = {
    [$type]: 'record',
    [$keys]: keys,
    [$elements]: elements,
    [$required]: state.required,
    [$hidden]: state.hidden,
    [$key]: state.key,
    [$savedAs]: state.savedAs,
    [$defaults]: state.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $record(keys, elements, overwrite(state, { required: nextRequired })),
    optional: () => $record(keys, elements, overwrite(state, { required: 'never' })),
    hidden: () => $record(keys, elements, overwrite(state, { hidden: true })),
    key: () => $record(keys, elements, overwrite(state, { key: true, required: 'always' })),
    savedAs: nextSavedAs => $record(keys, elements, overwrite(state, { savedAs: nextSavedAs })),
    keyDefault: nextKeyDefault =>
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    keyLink: nextKeyDefault =>
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
        elements,
        overwrite(state, {
          defaults: state.key
            ? { key: nextDefault, put: state.defaults.put, update: state.defaults.update }
            : { key: state.defaults.key, put: nextDefault, update: state.defaults.update }
        })
      ),
    freeze: path => freezeRecordAttribute(keys, elements, state, path)
  }

  return $recordAttribute
}

type RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  OPTIONS extends Partial<RecordAttributeOptions> = RecordAttributeOptions
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $RecordAttribute<
  $KEYS,
  $ELEMENTS,
  InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new record attribute
 * Not that record keys and elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not key (key: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param keys Keys (With constraints)
 * @param elements Attribute (With constraints)
 * @param options _(optional)_ Record Options
 */
export const record: RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  OPTIONS extends Partial<RecordAttributeOptions> = RecordAttributeOptions
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
): $RecordAttribute<
  $KEYS,
  $ELEMENTS,
  InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>
> => {
  const state = {
    ...RECORD_DEFAULT_OPTIONS,
    ...options,
    defaults: {
      ...RECORD_DEFAULT_OPTIONS.defaults,
      ...options?.defaults
    }
  } as InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>

  return $record(keys, elements, state)
}
