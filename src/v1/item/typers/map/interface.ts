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
/**
 * Mapped property interface
 * (Called Mapped to differ from native TS Map class)
 */
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
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => Mapped<P, $R, H, K, O, S, D>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Mapped<P, R, true, K, O, S, D>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Mapped<P, R, H, true, O, S, D>
  /**
   * Accept additional properties of any type
   */
  open: () => Mapped<P, R, H, K, true, S, D>
  /**
   * Rename property before save commands
   */
  savedAs: <$S extends string | undefined>(nextSavedAs: $S) => Mapped<P, R, H, K, O, $S, D>
  /**
   * Tag property as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <$D extends ComputedDefault | undefined>(
    nextDefaultValue: $D
  ) => Mapped<P, R, H, K, O, S, $D>
}
