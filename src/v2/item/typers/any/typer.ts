import type { O } from 'ts-toolbelt'

import { RequiredOption, Never, AtLeastOnce } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'
import type { Any } from './interface'
import { AnyOptions, anyDefaultOptions } from './options'

type AnyTyper = <
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends AnyDefaultValue = undefined
>(
  options?: O.Partial<AnyOptions<R, H, K, S, D>>
) => Any<R, H, K, S, D>

export const any: AnyTyper = <
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  S extends string | undefined = undefined,
  D extends AnyDefaultValue = undefined
>(
  options?: O.Partial<AnyOptions<R, H, K, S, D>>
): Any<R, H, K, S, D> => {
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
    required: <$R extends RequiredOption = AtLeastOnce>(
      nextRequired: $R = AtLeastOnce as unknown as $R
    ) => any({ ...appliedOptions, required: nextRequired }),
    hidden: () => any({ ...appliedOptions, hidden: true }),
    key: () => any({ ...appliedOptions, key: true }),
    savedAs: nextSavedAs => any({ ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => any({ ...appliedOptions, default: nextDefault })
  } as Any<R, H, K, S, D>
}
