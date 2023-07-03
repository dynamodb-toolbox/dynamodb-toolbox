import type { NarrowObject } from 'v1/types/narrowObject'

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

import type { $RecordAttributeKeys, $RecordAttributeElements } from './types'
import type { $RecordAttribute } from './interface'
import {
  RecordAttributeOptions,
  RecordAttributeDefaultOptions,
  RECORD_DEFAULT_OPTIONS
} from './options'

type RecordAttributeTyper = <
  KEYS extends $RecordAttributeKeys,
  ELEMENTS extends $RecordAttributeElements,
  OPTIONS extends Partial<RecordAttributeOptions> = RecordAttributeOptions
>(
  keys: KEYS,
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $RecordAttribute<
  KEYS,
  ELEMENTS,
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
  KEYS extends $RecordAttributeKeys,
  ELEMENTS extends $RecordAttributeElements,
  OPTIONS extends Partial<RecordAttributeOptions> = RecordAttributeOptions
>(
  keys: KEYS,
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = { ...RECORD_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'record',
    [$keys]: keys,
    [$elements]: elements,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$defaults]: appliedOptions.defaults,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => record(keys, elements, { ...appliedOptions, required: nextRequired }),
    optional: () => record(keys, elements, { ...appliedOptions, required: 'never' }),
    hidden: () => record(keys, elements, { ...appliedOptions, hidden: true }),
    key: () => record(keys, elements, { ...appliedOptions, key: true, required: 'always' }),
    savedAs: nextSavedAs => record(keys, elements, { ...appliedOptions, savedAs: nextSavedAs }),
    putDefault: nextPutDefault =>
      record(keys, elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, put: nextPutDefault }
      }),
    updateDefault: nextUpdateDefault =>
      record(keys, elements, {
        ...appliedOptions,
        defaults: { ...appliedOptions.defaults, update: nextUpdateDefault }
      }),
    defaults: nextDefaults =>
      record(keys, elements, {
        ...appliedOptions,
        defaults: { put: nextDefaults, update: nextDefaults }
      })
  } as $RecordAttribute<
    KEYS,
    ELEMENTS,
    InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>
  >
}
