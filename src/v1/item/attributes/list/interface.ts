import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { FreezeAttribute } from '../freeze'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'

import type { _ListAttributeElements, ListAttributeElements } from './types'

/**
 * List attribute interface
 */
export interface _ListAttribute<
  ELEMENTS extends _ListAttributeElements = _ListAttributeElements,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  [$type]: 'list'
  [$elements]: ELEMENTS
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
  ) => _ListAttribute<ELEMENTS, NEXT_IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _ListAttribute<ELEMENTS, 'never', IS_HIDDEN, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ListAttribute<ELEMENTS, IS_REQUIRED, true, IS_KEY, SAVED_AS, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, true, SAVED_AS, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, NEXT_SAVED_AS, DEFAULT>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _ListAttribute<ELEMENTS, IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS, NEXT_DEFAULT>
}

export interface ListAttribute<
  ELEMENTS extends ListAttributeElements = ListAttributeElements,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  type: 'list'
  elements: ELEMENTS
  default: DEFAULT
  path: string
}

export type FreezeListAttribute<_LIST_ATTRIBUTE extends _ListAttribute> = ListAttribute<
  FreezeAttribute<_LIST_ATTRIBUTE[$elements]>,
  _LIST_ATTRIBUTE[$required],
  _LIST_ATTRIBUTE[$hidden],
  _LIST_ATTRIBUTE[$key],
  _LIST_ATTRIBUTE[$savedAs],
  _LIST_ATTRIBUTE[$default]
>
