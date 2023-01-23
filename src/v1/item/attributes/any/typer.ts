import type { O } from 'ts-toolbelt'

import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { $type, $required, $hidden, $key, $savedAs, $default } from '../constants/symbols'

import type { AnyAttributeDefaultValue } from './types'
import type { _AnyAttribute } from './interface'
import { AnyAttributeOptions, ANY_DEFAULT_OPTIONS } from './options'

type AnyAttributeTyper = <
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends AnyAttributeDefaultValue = undefined
>(
  options?: O.Partial<AnyAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
) => _AnyAttribute<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>

/**
 * Define a new attribute of any type
 *
 * @param options _(optional)_ Boolean Options
 */
export const any: AnyAttributeTyper = <
  IS_REQUIRED extends RequiredOption = AtLeastOnce,
  IS_HIDDEN extends boolean = false,
  IS_KEY extends boolean = false,
  SAVED_AS extends string | undefined = undefined,
  DEFAULT extends AnyAttributeDefaultValue = undefined
>(
  options?: O.Partial<AnyAttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>>
): _AnyAttribute<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT> => {
  const appliedOptions = { ...ANY_DEFAULT_OPTIONS, ...options }

  return {
    [$type]: 'any',
    [$required]: appliedOptions.required,
    [$hidden]: appliedOptions.hidden,
    [$key]: appliedOptions.key,
    [$savedAs]: appliedOptions.savedAs,
    [$default]: appliedOptions.default,
    required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
      nextRequired: NEXT_REQUIRED = ('atLeastOnce' as unknown) as NEXT_REQUIRED
    ) => any({ ...appliedOptions, required: nextRequired }),
    optional: () => any({ ...appliedOptions, required: 'never' }),
    hidden: () => any({ ...appliedOptions, hidden: true }),
    key: () => any({ ...appliedOptions, key: true }),
    savedAs: nextSavedAs => any({ ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => any({ ...appliedOptions, default: nextDefault })
  } as _AnyAttribute<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
}
