import type { NarrowObject } from '~/types/narrowObject.js'

import type { InferStateFromOptions } from '../shared/inferStateFromOptions.js'
import { $RecordAttribute } from './interface.js'
import { RECORD_DEFAULT_OPTIONS } from './options.js'
import type { RecordAttributeDefaultOptions, RecordAttributeOptions } from './options.js'
import type { $RecordAttributeElements, $RecordAttributeKeys } from './types.js'

type RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  OPTIONS extends Partial<RecordAttributeOptions> = RecordAttributeOptions
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $RecordAttribute<
  InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>,
  $KEYS,
  $ELEMENTS
>

/**
 * Define a new record attribute
 * Note that record keys and elements have constraints. They must be:
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
  InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>,
  $KEYS,
  $ELEMENTS
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
    },
    validators: {
      ...RECORD_DEFAULT_OPTIONS.validators,
      ...options?.validators
    }
  } as InferStateFromOptions<RecordAttributeOptions, RecordAttributeDefaultOptions, OPTIONS>

  return new $RecordAttribute(state, keys, elements)
}
