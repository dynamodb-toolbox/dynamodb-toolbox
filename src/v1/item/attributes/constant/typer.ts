import type { NarrowObject } from 'v1/types/narrowObject'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import {
  $type,
  $value,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { InferStateFromOptions } from '../shared/inferStateFromOptions'
import type { ResolvedAttribute } from '../types'

import type { _ConstantAttribute } from './interface'
import {
  ConstantAttributeOptions,
  ConstantAttributeDefaultOptions,
  CONSTANT_DEFAULT_OPTIONS
} from './options'

type ConstantAttributeTyper = <
  VALUE extends ResolvedAttribute,
  OPTIONS extends Partial<ConstantAttributeOptions<VALUE>> = ConstantAttributeOptions<VALUE>
>(
  value: VALUE,
  options?: NarrowObject<OPTIONS>
) => _ConstantAttribute<
  VALUE,
  InferStateFromOptions<ConstantAttributeOptions<VALUE>, ConstantAttributeDefaultOptions, OPTIONS>
>

/**
 * Define a new constant attribute
 *
 * @param value Valid DynamoDB value
 * @param options _(optional)_ Constant Options
 */
export const constant: ConstantAttributeTyper = <
  VALUE extends ResolvedAttribute,
  OPTIONS extends Partial<ConstantAttributeOptions<VALUE>> = ConstantAttributeOptions<VALUE>
>(
  value: VALUE,
  options?: NarrowObject<OPTIONS>
) => {
  const appliedOptions = { ...CONSTANT_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'constant',
    [$value]: value,
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired = 'atLeastOnce' as NEXT_REQUIRED
    ) => constant(value, { ...appliedOptions, required: nextRequired }),
    optional: () => constant(value, { ...appliedOptions, required: 'never' }),
    hidden: () => constant(value, { ...appliedOptions, hidden: true }),
    key: () => constant(value, { ...appliedOptions, key: true }),
    savedAs: nextSavedAs => constant(value, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => constant(value, { ...appliedOptions, default: nextDefault })
  } as _ConstantAttribute<
    VALUE,
    InferStateFromOptions<ConstantAttributeOptions<VALUE>, ConstantAttributeDefaultOptions, OPTIONS>
  >
}
