import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { AttributeState } from '../attribute/interface'
import type { ListElements } from './types'

interface ListState<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeState<IsRequired, IsHidden, IsKey, SavedAs> {
  _default: Default
}

/**
 * List attribute interface
 */
export interface List<
  Elements extends ListElements = ListElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends ListState<IsRequired, IsHidden, IsKey, SavedAs, Default> {
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
  required: <$R extends RequiredOption = AtLeastOnce>(
    nextRequired?: $R
  ) => List<Elements, $R, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => List<Elements, IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => List<Elements, IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <$S extends string | undefined>(
    nextSavedAs: $S
  ) => List<Elements, IsRequired, IsHidden, IsKey, $S, Default>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <$D extends ComputedDefault | undefined>(
    nextDefaultValue: $D
  ) => List<Elements, IsRequired, IsHidden, IsKey, SavedAs, $D>
}
