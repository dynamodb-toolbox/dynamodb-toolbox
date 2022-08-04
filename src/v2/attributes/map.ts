import { O } from 'ts-toolbelt'

import { MappedProperties } from './property'
import { Narrow } from './utility'

interface _MappedOptions<R extends boolean = boolean, H extends boolean = boolean> {
  _required: R
  _hidden: H
  // May be handled later
  _default: undefined
}

export interface Mapped<
  P extends MappedProperties = MappedProperties,
  R extends boolean = boolean,
  H extends boolean = boolean
> extends _MappedOptions<R, H> {
  _type: 'map'
  _properties: P
  required: () => Mapped<P, true, H>
  hidden: () => Mapped<P, R, true>
}

interface MappedOptions<R extends boolean = boolean, H extends boolean = boolean> {
  required: R
  hidden: H
  default: undefined
}

const mappedDefaultOptions: MappedOptions<false, false> = {
  required: false,
  hidden: false,
  default: undefined
}

type MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H>>
) => Mapped<P, R, H>

export const map: MappedTyper = <
  P extends MappedProperties = {},
  R extends boolean = false,
  H extends boolean = false
>(
  _properties: Narrow<P>,
  options?: O.Partial<MappedOptions<R, H>>
): Mapped<P, R, H> => {
  const appliedOptions = { ...mappedDefaultOptions, ...options }
  const { required: _required, hidden: _hidden } = appliedOptions

  return {
    _type: 'map',
    _properties,
    _required,
    _hidden,
    required: () => map(_properties, { ...appliedOptions, required: true }),
    hidden: () => map(_properties, { ...appliedOptions, hidden: true })
  } as Mapped<P, R, H>
}
