import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AttributeState } from '../attribute/interface'
import type { AnyDefaultValue } from './types'

interface AnyState<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends AttributeState<IsRequired, IsHidden, IsKey, SavedAs> {
  _default: Default
}

/**
 * Any attribute interface
 */
export interface Any<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends AnyState<IsRequired, IsHidden, IsKey, SavedAs, Default> {
  _type: 'any'
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
  ) => Any<NextIsRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => Any<IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => Any<IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => Any<IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NextDefaultValue extends AnyDefaultValue>(
    nextDefaultValue: NextDefaultValue
  ) => Any<IsRequired, IsHidden, IsKey, SavedAs, NextDefaultValue>
}
