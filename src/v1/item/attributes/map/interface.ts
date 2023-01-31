import type { O } from 'ts-toolbelt'

import type { _MapAttributeAttributes, MapAttributeAttributes } from '../types/attribute'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { FreezeAttributeStateConstraint } from '../shared/freezeAttributeStateConstraint'

interface _MapAttributeStateConstraint {
  [$required]: RequiredOption
  [$hidden]: boolean
  [$key]: boolean
  [$open]: boolean
  [$savedAs]: string | undefined
  [$default]: ComputedDefault | undefined
}

/**
 * MapAttribute attribute interface
 */
export interface _MapAttribute<
  ATTRIBUTES extends _MapAttributeAttributes = _MapAttributeAttributes,
  STATE extends _MapAttributeStateConstraint = _MapAttributeStateConstraint
> {
  [$type]: 'map'
  [$attributes]: ATTRIBUTES
  [$required]: STATE[$required]
  [$hidden]: STATE[$hidden]
  [$key]: STATE[$key]
  [$open]: STATE[$open]
  [$savedAs]: STATE[$savedAs]
  [$default]: STATE[$default]
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_REQUIRED
  ) => _MapAttribute<ATTRIBUTES, O.Update<STATE, $required, NEXT_REQUIRED>>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _MapAttribute<ATTRIBUTES, O.Update<STATE, $required, 'never'>>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _MapAttribute<ATTRIBUTES, O.Update<STATE, $hidden, true>>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _MapAttribute<ATTRIBUTES, O.Update<STATE, $key, true>>
  /**
   * Accept additional attributes of any type
   */
  open: () => _MapAttribute<ATTRIBUTES, O.Update<STATE, $open, true>>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _MapAttribute<ATTRIBUTES, O.Update<STATE, $savedAs, NEXT_SAVED_AS>>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _MapAttribute<ATTRIBUTES, O.Update<STATE, $default, NEXT_DEFAULT>>
}

export type MapAttributeStateConstraint = FreezeAttributeStateConstraint<_MapAttributeStateConstraint>

export interface MapAttribute<
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes,
  STATE extends MapAttributeStateConstraint = MapAttributeStateConstraint
> {
  path: string
  type: 'map'
  attributes: ATTRIBUTES
  required: STATE['required']
  hidden: STATE['hidden']
  key: STATE['key']
  open: STATE['open']
  savedAs: STATE['savedAs']
  default: STATE['default']
  keyAttributesNames: Set<string>
  requiredAttributesNames: Record<RequiredOption, Set<string>>
}
