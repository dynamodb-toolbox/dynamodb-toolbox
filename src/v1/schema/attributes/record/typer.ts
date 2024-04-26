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
  $defaults,
  $links
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import type { SharedAttributeState } from '../shared/interface'

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
  STATE extends SharedAttributeState = SharedAttributeState
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: STATE
) => $RecordAttribute<$KEYS, $ELEMENTS, STATE>

const $record: $RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeState = SharedAttributeState
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
    [$links]: state.links,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => $record(keys, elements, overwrite(state, { required: nextRequired })),
    optional: () => $record(keys, elements, overwrite(state, { required: 'never' })),
    hidden: <NEXT_HIDDEN extends boolean = true>(nextHidden: NEXT_HIDDEN = true as NEXT_HIDDEN) =>
      $record(keys, elements, overwrite(state, { hidden: nextHidden })),
    key: <NEXT_KEY extends boolean = true>(nextKey: NEXT_KEY = true as NEXT_KEY) =>
      $record(keys, elements, overwrite(state, { key: nextKey, required: 'always' })),
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
    keyLink: nextKeyLink =>
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
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
      $record(
        keys,
        elements,
        overwrite(state, {
          links: state.key
            ? { key: nextLink, put: state.links.put, update: state.links.update }
            : { key: state.links.key, put: nextLink, update: state.links.update }
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
    },
    links: {
      ...RECORD_DEFAULT_OPTIONS.links,
      ...options?.links
    }
  } as InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>

  return $record(keys, elements, state)
}
