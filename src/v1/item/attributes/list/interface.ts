import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { AttributeProperties } from '../shared/interface'
import type { ListAttributeElements } from './types'

interface ListAttributeProperties<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _default: Default
}

/**
 * List attribute interface
 */
export interface ListAttribute<
  Elements extends ListAttributeElements = ListAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends ListAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs, Default> {
  _type: 'list'
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
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => ListAttribute<Elements, NextRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => ListAttribute<Elements, IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => ListAttribute<Elements, IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => ListAttribute<Elements, IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NextDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextDefault
  ) => ListAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, NextDefault>
}
