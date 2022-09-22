import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

import type { PropertyState } from '../property/interface'
import type { ListProperty } from './types'

interface ListState<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyState<Required, Hidden, Key, SavedAs> {
  _default: Default
}

/**
 * List property interface
 */
export interface List<
  Elements extends ListProperty = ListProperty,
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends ListState<Required, Hidden, Key, SavedAs, Default> {
  _type: 'list'
  _elements: Elements
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
  ) => List<Elements, $R, Hidden, Key, SavedAs, Default>
  /**
   * Hide property after fetch commands and formatting
   */
  hidden: () => List<Elements, Required, true, Key, SavedAs, Default>
  /**
   * Tag property as needed for Primary Key computing
   */
  key: () => List<Elements, Required, Hidden, true, SavedAs, Default>
  /**
   * Rename property before save commands
   */
  savedAs: <$S extends string | undefined>(
    nextSavedAs: $S
  ) => List<Elements, Required, Hidden, Key, $S, Default>
  /**
   * Tag property as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <$D extends ComputedDefault | undefined>(
    nextDefaultValue: $D
  ) => List<Elements, Required, Hidden, Key, SavedAs, $D>
}
