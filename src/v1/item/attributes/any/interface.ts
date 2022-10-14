import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'

import type { AttributeProperties } from '../shared/interface'
import type { AnyAttributeDefaultValue } from './types'

interface AnyAttributeProperties<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _default: Default
}

/**
 * Any attribute interface
 */
export interface AnyAttribute<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends AnyAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs, Default> {
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
  ) => AnyAttribute<NextIsRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => AnyAttribute<IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => AnyAttribute<IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => AnyAttribute<IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NextDefaultValue extends AnyAttributeDefaultValue>(
    nextDefaultValue: NextDefaultValue
  ) => AnyAttribute<IsRequired, IsHidden, IsKey, SavedAs, NextDefaultValue>
}
