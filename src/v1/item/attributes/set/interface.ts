import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { ComputedDefault } from '../constants/computedDefault'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import type { FreezeAttribute } from '../freeze'
import type { _SetAttributeElements, SetAttributeElements } from './types'

/**
 * Set attribute interface
 */
export type _SetAttribute<
  ELEMENTS extends _SetAttributeElements = _SetAttributeElements,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> = _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  _type: 'set'
  _elements: ELEMENTS
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
  ) => _SetAttribute<ELEMENTS, NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _SetAttribute<ELEMENTS, 'never', IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _SetAttribute<ELEMENTS, IS_REQUIRED, true, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, DEFAULT>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _SetAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, NEXT_DEFAULT>
}

export type SetAttribute<
  ELEMENTS extends SetAttributeElements = SetAttributeElements,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> = AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> & {
  type: 'set'
  path: string
  elements: ELEMENTS
  default: DEFAULT
}

export type FreezeSetAttribute<_SET_ATTRIBUTE extends _SetAttribute> = SetAttribute<
  FreezeAttribute<_SET_ATTRIBUTE['_elements']>,
  _SET_ATTRIBUTE['_required'],
  _SET_ATTRIBUTE['_hidden'],
  _SET_ATTRIBUTE['_key'],
  _SET_ATTRIBUTE['_savedAs'],
  _SET_ATTRIBUTE['_default']
>
