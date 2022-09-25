import type { O } from 'ts-toolbelt'

import type { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'
import type { Any } from './interface'
import { AnyOptions, anyDefaultOptions } from './options'

type AnyTyper = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends AnyDefaultValue = undefined
>(
  options?: O.Partial<AnyOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
) => Any<IsRequired, IsHidden, IsKey, SavedAs, Default>

/**
 * Define a new property of any type
 *
 * @param options _(optional)_ Boolean Options
 */
export const any: AnyTyper = <
  IsRequired extends RequiredOption = Never,
  IsHidden extends boolean = false,
  IsKey extends boolean = false,
  SavedAs extends string | undefined = undefined,
  Default extends AnyDefaultValue = undefined
>(
  options?: O.Partial<AnyOptions<IsRequired, IsHidden, IsKey, SavedAs, Default>>
): Any<IsRequired, IsHidden, IsKey, SavedAs, Default> => {
  const appliedOptions = { ...anyDefaultOptions, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'any',
    _required,
    _hidden,
    _key,
    _savedAs,
    _default,
    required: <NextRequired extends RequiredOption = AtLeastOnce>(
      nextRequired: NextRequired = ('atLeastOnce' as unknown) as NextRequired
    ) => any({ ...appliedOptions, required: nextRequired }),
    hidden: () => any({ ...appliedOptions, hidden: true }),
    key: () => any({ ...appliedOptions, key: true }),
    savedAs: nextSavedAs => any({ ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => any({ ...appliedOptions, default: nextDefault })
  } as Any<IsRequired, IsHidden, IsKey, SavedAs, Default>
}
