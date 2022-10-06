import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { ComputedDefault } from '../constants'

import type { AttributeProperties } from '../attribute/interface'
import type { SetAttributeElements } from './types'

interface SetAttributeProperties<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _default: Default
}

/**
 * Set attribute interface
 */
export type SetAttribute<
  Elements extends SetAttributeElements = SetAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> = SetAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs, Default> & {
  _type: 'set'
  _elements: Elements
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextIsRequired
  ) => SetAttribute<Elements, NextIsRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => SetAttribute<Elements, IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => SetAttribute<Elements, IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => SetAttribute<Elements, IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NextDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextDefault
  ) => SetAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, NextDefault>
}
