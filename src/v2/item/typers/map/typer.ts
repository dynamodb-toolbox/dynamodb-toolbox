import type { O } from 'ts-toolbelt'

import { ComputedDefault, RequiredOption, Never, AtLeastOnce } from '../constants'
import type { MappedProperties, Narrow } from '../types'

import type { Mapped } from './interface'
import { MappedOptions, mappedDefaultOptions } from './options'

type MappedTyper = <
  P extends MappedProperties = {},
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  O extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, K, O, S, D>>
) => Mapped<P, R, H, K, O, S, D>

export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  O extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, K, O, S, D>>
): Mapped<P, R, H, K, O, S, D> => {
  const appliedOptions = { ...mappedDefaultOptions, ...options }
  const {
    required: _required,
    hidden: _hidden,
    key: _key,
    open: _open,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'map',
    _properties,
    _required,
    _hidden,
    _key,
    _open,
    _savedAs,
    _default,
    required: <$R extends RequiredOption = AtLeastOnce>(
      nextRequired: $R = AtLeastOnce as unknown as $R
    ) => map(_properties, { ...appliedOptions, required: nextRequired }),
    hidden: () => map(_properties, { ...appliedOptions, hidden: true }),
    key: () => map(_properties, { ...appliedOptions, key: true }),
    open: () => map(_properties, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(_properties, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(_properties, { ...appliedOptions, default: nextDefault })
  } as Mapped<P, R, H, K, O, S, D>
}
