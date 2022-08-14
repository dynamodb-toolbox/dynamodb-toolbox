import { O } from 'ts-toolbelt'

import { ResolvedProperty } from './property'
import { RequiredOption, Never, AtLeastOnce } from './requiredOptions'
import { ComputedDefault } from './utility'

type AnyDefaultValue = undefined | ComputedDefault | ResolvedProperty | (() => ResolvedProperty)

interface _AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  _required: R
  _hidden: H
  _key: K
  _savedAs: S
  _default: D
}

export interface Any<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> extends _AnyOptions<R, H, K, S, D> {
  _type: 'any'
  required: <$R extends RequiredOption = AtLeastOnce>(nextRequired?: $R) => Any<$R, H, K, S, D>
  hidden: () => Any<R, true, K, S, D>
  key: () => Any<R, H, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Any<R, H, K, $S, D>
  default: <$D extends AnyDefaultValue>(nextDefaultValue: $D) => Any<R, H, K, S, $D>
}

interface AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> {
  required: R
  hidden: H
  key: K
  savedAs: S
  default: D
}

const anyDefaultOptions: AnyOptions<Never, false, false, undefined, undefined> = {
  required: Never,
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}

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

export const validateAny = <A extends Any>(anyInstance: A, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)
  anyInstance
  path

  return true
}
