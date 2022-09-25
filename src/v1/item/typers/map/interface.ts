import type { PropertyState } from '../property/interface'
import type { MappedProperties } from '../types/property'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

interface MappedState<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyState<IsRequired, IsHidden, IsKey, SavedAs> {
  _open: IsOpen
  _default: Default
}

// TODO: Add false saveAs option
/**
 * Mapped property interface
 * (Called Mapped to differ from native TS Map class)
 */
export interface Mapped<
  Properties extends MappedProperties = MappedProperties,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends MappedState<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default> {
  _type: 'map'
  _properties: Properties
  /**
   * Tag a property as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => Mapped<Properties, NextRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Mapped<Properties, IsRequired, true, IsKey, IsOpen, SavedAs, Default>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Mapped<Properties, IsRequired, IsHidden, true, IsOpen, SavedAs, Default>
  /**
   * Accept additional properties of any type
   */
  open: () => Mapped<Properties, IsRequired, IsHidden, IsKey, true, SavedAs, Default>
  /**
   * Rename property before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Mapped<Properties, IsRequired, IsHidden, IsKey, IsOpen, NextSavedAs, Default>
  /**
   * Tag property as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NextComputeDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextComputeDefault
  ) => Mapped<Properties, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, NextComputeDefault>
}
