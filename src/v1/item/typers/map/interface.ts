import type { PropertyState } from '../property/interface'
import type { MappedProperties } from '../types/property'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

interface MappedState<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  Open extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyState<Required, Hidden, Key, SavedAs> {
  _open: Open
  _default: Default
}

// TODO: Add false saveAs option
/**
 * Mapped property interface
 * (Called Mapped to differ from native TS Map class)
 */
export interface Mapped<
  Properties extends MappedProperties = MappedProperties,
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  Open extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends MappedState<Required, Hidden, Key, Open, SavedAs, Default> {
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
  ) => Mapped<Properties, NextRequired, Hidden, Key, Open, SavedAs, Default>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => Mapped<Properties, Required, true, Key, Open, SavedAs, Default>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => Mapped<Properties, Required, Hidden, true, Open, SavedAs, Default>
  /**
   * Accept additional properties of any type
   */
  open: () => Mapped<Properties, Required, Hidden, Key, true, SavedAs, Default>
  /**
   * Rename property before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Mapped<Properties, Required, Hidden, Key, Open, NextSavedAs, Default>
  /**
   * Tag property as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NextComputeDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextComputeDefault
  ) => Mapped<Properties, Required, Hidden, Key, Open, SavedAs, NextComputeDefault>
}
