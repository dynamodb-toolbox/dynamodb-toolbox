import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import {
  $type,
  $value,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import { ResolvedAttribute } from '../types'

import { ConstantAttributeDefaultValue } from './types'

/**
 * Const attribute interface
 */
export type _ConstantAttribute<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ConstantAttributeDefaultValue<VALUE> = ConstantAttributeDefaultValue<VALUE>
> = _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  [$type]: 'constant'
  [$value]: VALUE
  [$default]: DEFAULT
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
  ) => _ConstantAttribute<VALUE, NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _ConstantAttribute<VALUE, 'never', IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ConstantAttribute<VALUE, IS_REQUIRED, true, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, DEFAULT>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ConstantAttributeDefaultValue<VALUE>>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _ConstantAttribute<VALUE, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, NEXT_DEFAULT>
}

export type ConstantAttribute<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ConstantAttributeDefaultValue<VALUE> = ConstantAttributeDefaultValue<VALUE>
> = AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  path: string
  type: 'constant'
  value: VALUE
  default: DEFAULT
}

export type FreezeConstantAttribute<
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
> = ConstantAttribute<
  _CONSTANT_ATTRIBUTE[$value],
  _CONSTANT_ATTRIBUTE[$required],
  _CONSTANT_ATTRIBUTE[$hidden],
  _CONSTANT_ATTRIBUTE[$key],
  _CONSTANT_ATTRIBUTE[$savedAs],
  _CONSTANT_ATTRIBUTE[$default]
>
