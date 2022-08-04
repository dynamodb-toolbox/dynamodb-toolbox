import { O } from 'ts-toolbelt'

import { MappedProperties } from './property'
import { ComputedDefault, Narrow } from './utility'

interface _MappedOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _default: D
}

export interface Mapped<
  P extends MappedProperties = MappedProperties,
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _MappedOptions<R, H> {
  _type: 'map'
  _properties: P
  _default: D
  required: () => Mapped<P, true, H, D>
  hidden: () => Mapped<P, R, true, D>
  default: <$D extends ComputedDefault | undefined>(nextDefaultValue: $D) => Mapped<P, R, H, $D>
}

interface MappedOptions<
  R extends boolean = boolean,
  H extends boolean = boolean,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  required: R
  hidden: H
  default: D
}

const mappedDefaultOptions: MappedOptions<false, false, undefined> = {
  required: false,
  hidden: false,
  default: undefined
}

type MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, D>>
) => Mapped<P, R, H, D>

export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false,
  D extends ComputedDefault | undefined = undefined
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H, D>>
): Mapped<P, R, H, D> => {
  const appliedOptions = { ...mappedDefaultOptions, ...options }
  const { required: _required, hidden: _hidden, default: _default } = appliedOptions

  return {
    _type: 'map',
    _properties,
    _required,
    _hidden,
    _default,
    required: () => map(_properties, { ...appliedOptions, required: true }),
    hidden: () => map(_properties, { ...appliedOptions, hidden: true }),
    default: nextDefault => map(_properties, { ...appliedOptions, default: nextDefault })
  } as Mapped<P, R, H, D>
}
