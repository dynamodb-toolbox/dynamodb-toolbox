import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { MappedProperties } from '../types/property'

interface MappedState<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> {
  _required: R
  _hidden: H
  _key: K
  _open: O
  _savedAs: S
  _default: D
}

// TODO: Add false saveAs option
export interface Mapped<
  P extends MappedProperties = MappedProperties,
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends MappedState<R, H, K, O, S, D> {
  _type: 'map'
  _properties: P
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => Mapped<P, $R, H, K, O, S, D>
  hidden: () => Mapped<P, R, true, K, O, S, D>
  key: () => Mapped<P, R, H, true, O, S, D>
  open: () => Mapped<P, R, H, K, true, S, D>
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Mapped<P, R, H, K, O, $S, D>
  default: <$D extends ComputedDefault | undefined>(
    nextDefaultValue: $D
  ) => Mapped<P, R, H, K, O, S, $D>
}
