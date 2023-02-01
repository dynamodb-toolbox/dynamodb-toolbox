import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'

import type { $SetAttribute } from './interface'
import {
  SetAttributeOptions,
  SetAttributeDefaultOptions,
  SET_ATTRIBUTE_DEFAULT_OPTIONS
} from './options'
import type { $SetAttributeElements } from './types'

type SetAttributeTyper = <
  ELEMENTS extends $SetAttributeElements,
  OPTIONS extends Partial<SetAttributeOptions> = SetAttributeOptions
>(
  elements: ELEMENTS,
  options?: NarrowObject<OPTIONS>
) => $SetAttribute<
  ELEMENTS,
  InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new set attribute
 * Not that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Doesn't have a default value (default: undefined)
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
) => {
  const appliedOptions = { ...SET_ATTRIBUTE_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'set',
    [$elements]: elements,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_IS_REQUIRED = 'atLeastOnce' as NEXT_IS_REQUIRED
    ) => set(elements, { ...appliedOptions, required: nextRequired }),
    optional: () => set(elements, { ...appliedOptions, required: 'never' }),
    hidden: () => set(elements, { ...appliedOptions, hidden: true }),
    key: () => set(elements, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => set(elements, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => set(elements, { ...appliedOptions, default: nextDefault })
  } as $SetAttribute<
    ELEMENTS,
    InferStateFromOptions<SetAttributeOptions, SetAttributeDefaultOptions, OPTIONS>
  >
}
