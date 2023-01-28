import type { O } from 'ts-toolbelt'

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
import { ResolvedAttribute } from '../types'

import type { _ConstantAttribute } from './interface'
import { ConstAttributeOptions, CONST_DEFAULT_OPTIONS } from './options'
import type { ConstantAttributeDefaultValue } from './types'

/**
 * @debt refactor "Use ts-toolbelt with increased version when possible"
 */
type Narrow<A> =
  | (A extends [] ? [] : never)
  | (A extends string | number | boolean ? A : never)
  | {
      [K in keyof A]: A[K] extends (...args: unknown[]) => unknown ? A[K] : Narrow<A[K]>
    }

type ConstantTyper = <
  VALUE extends ResolvedAttribute,
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends ConstantAttributeDefaultValue<VALUE> = undefined
>(
  _elements: Narrow<VALUE>,
  options?: O.Partial<
    ConstAttributeOptions<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  >
) => _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>

/**
 * Define a new constant attribute
 *
 * @param value Valid DynamoDB value
 * @param options _(optional)_ Constant Options
 */
export const constant: ConstantTyper = <
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ConstantAttributeDefaultValue<VALUE> = ConstantAttributeDefaultValue<VALUE>
>(
  value: Narrow<VALUE>,
  options?: O.Partial<
    ConstAttributeOptions<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  >
): _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT> => {
  const appliedOptions = { ...CONST_DEFAULT_OPTIONS, ...options }

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
  } as _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
}
