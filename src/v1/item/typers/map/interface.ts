import type { AttributeProperties } from '../attribute/interface'
import type { MappedAttributes } from '../types/attribute'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

interface MappedProperties<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _open: IsOpen
  _default: Default
}

// TODO: Add false saveAs option
/**
 * Mapped attribute interface
 * (Called Mapped to differ from native TS Map class)
 */
export interface Mapped<
  Attributes extends MappedAttributes = MappedAttributes,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends MappedProperties<IsRequired, IsHidden, IsKey, IsOpen, SavedAs, Default> {
  _type: 'map'
  _attributes: Attributes
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => Mapped<Attributes, NextRequired, IsHidden, IsKey, IsOpen, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => Mapped<Attributes, IsRequired, true, IsKey, IsOpen, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => Mapped<Attributes, IsRequired, IsHidden, true, IsOpen, SavedAs, Default>
  /**
   * Accept additional attributes of any type
   */
  open: () => Mapped<Attributes, IsRequired, IsHidden, IsKey, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Mapped<Attributes, IsRequired, IsHidden, IsKey, IsOpen, NextSavedAs, Default>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NextComputeDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextComputeDefault
  ) => Mapped<Attributes, IsRequired, IsHidden, IsKey, IsOpen, SavedAs, NextComputeDefault>
}
