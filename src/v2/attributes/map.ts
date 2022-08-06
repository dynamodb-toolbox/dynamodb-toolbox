import { O } from 'ts-toolbelt'

import { MappedProperties } from './property'
import { ComputedDefault, Narrow } from './utility'

interface _MappedOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _savedAs: S
  _default: D
}

export interface Mapped<
  P extends MappedProperties = MappedProperties,
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _MappedOptions<R, H, S, D> {
  _type: 'map'
  _properties: P
  required: () => Mapped<P, true, H, S, D>
  hidden: () => Mapped<P, R, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Mapped<P, R, H, $S, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => Mapped<P, R, H, S, $D>
}

interface MappedOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  savedAs: S
  default: D
}

const mappedDefaultOptions: MappedOptions<false, false, undefined, undefined> = {
  required: false,
  hidden: false,
  savedAs: undefined,
  default: undefined
}

type MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, S, D>>
) => Mapped<P, R, H, S, D>

export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false,
  S extends string | undefined = undefined,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, S, D>>
): Mapped<P, R, H, S, D> => {
  const appliedOptions = { ...mappedDefaultOptions, ...options }
  const {
    required: _required,
    hidden: _hidden,
    savedAs: _savedAs,
    default: _default
  } = appliedOptions

  return {
    _type: 'map',
    _properties,
    _required,
    _hidden,
    _savedAs,
    _default,
    required: () => map(_properties, { ...appliedOptions, required: true }),
    hidden: () => map(_properties, { ...appliedOptions, hidden: true }),
    savedAs: nextSavedAs => map(_properties, { ...appliedOptions, savedAs: nextSavedAs }),
    default: nextDefault => map(_properties, { ...appliedOptions, default: nextDefault })
  } as Mapped<P, R, H, S, D>
}
