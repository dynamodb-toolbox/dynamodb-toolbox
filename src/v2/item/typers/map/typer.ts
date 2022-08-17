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

/**
 * Define a new map property
 *
 * @param properties Dictionary of properties
 * @param options _(optional)_ Map Options
 */
export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends RequiredOption = Never,
  H extends boolean = false,
  K extends boolean = false,
  O extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  properties: Narrow<P>,
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
    _properties: properties,
    _required,
    _hidden,
    _key,
    _open,
    _savedAs,
    _default,
    required: <$R extends RequiredOption = AtLeastOnce>(
      nextRequired: $R = AtLeastOnce as unknown as $R
    ) => map(properties, { ...appliedOptions, required: nextRequired }),
    hidden: () => map(properties, { ...appliedOptions, hidden: true }),
    key: () => map(properties, { ...appliedOptions, key: true }),
    open: () => map(properties, { ...appliedOptions, open: true }),
    savedAs: nextSavedAs => map(properties, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(properties, { ...appliedOptions, default: nextDefault })
  } as Mapped<P, R, H, K, O, S, D>
}
