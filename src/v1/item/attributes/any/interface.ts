import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'

import type { AnyAttributeDefaultValue } from './types'

/**
 * Any attribute interface
 */
export interface _AnyAttribute<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  _type: 'any'
  _default: DEFAULT
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_IS_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_IS_REQUIRED
  ) => _AnyAttribute<NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _AnyAttribute<IS_REQUIRED, true, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _AnyAttribute<IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _AnyAttribute<IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, DEFAULT>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `any`, `() => any`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT_VALUE extends AnyAttributeDefaultValue>(
    nextDefaultValue: NEXT_DEFAULT_VALUE
  ) => _AnyAttribute<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, NEXT_DEFAULT_VALUE>
}

export interface AnyAttribute<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends AnyAttributeDefaultValue = AnyAttributeDefaultValue
> extends AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  type: 'any'
  default: DEFAULT
  path: string
}

export type FreezeAnyAttribute<_ANY_ATTRIBUTE extends _AnyAttribute> = AnyAttribute<
  _ANY_ATTRIBUTE['_required'],
  _ANY_ATTRIBUTE['_hidden'],
  _ANY_ATTRIBUTE['_key'],
  _ANY_ATTRIBUTE['_savedAs'],
  _ANY_ATTRIBUTE['_default']
>
