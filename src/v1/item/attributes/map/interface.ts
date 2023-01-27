import type { _MapAttributeAttributes, MapAttributeAttributes } from '../types/attribute'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { FreezeAttribute } from '../freeze'
import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $open,
  $savedAs,
  $default
} from '../constants/attributeOptions'

/**
 * MapAttribute attribute interface
 * (Called MapAttribute to differ from native TS Map class)
 */
export interface _MapAttribute<
  ATTRIBUTES extends _MapAttributeAttributes = _MapAttributeAttributes,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  IS_OPEN extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> extends _AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  [$type]: 'map'
  [$attributes]: ATTRIBUTES
  [$open]: IS_OPEN
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
  required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_REQUIRED
  ) => _MapAttribute<ATTRIBUTES, NEXT_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
  /**
   * Shorthand for `required('never')`
   */
  optional: () => _MapAttribute<ATTRIBUTES, 'never', IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _MapAttribute<ATTRIBUTES, IS_REQUIRED, true, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, true, IS_OPEN, SAVED_AS, DEFAULT>
  /**
   * Accept additional attributes of any type
   */
  open: () => _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, true, SAVED_AS, DEFAULT>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NEXT_SAVED_AS extends string | undefined>(
    nextSavedAs: NEXT_SAVED_AS
  ) => _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, NEXT_SAVED_AS, DEFAULT>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NEXT_DEFAULT extends ComputedDefault | undefined>(
    nextDefaultValue: NEXT_DEFAULT
  ) => _MapAttribute<ATTRIBUTES, IS_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, NEXT_DEFAULT>
}

export interface MapAttribute<
  ATTRIBUTES extends MapAttributeAttributes = MapAttributeAttributes,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  IS_OPEN extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  type: 'map'
  attributes: ATTRIBUTES
  open: IS_OPEN
  default: DEFAULT
  path: string
  keyAttributesNames: Set<string>
  requiredAttributesNames: Record<RequiredOption, Set<string>>
}

export type FreezeMapAttribute<_MAP_ATTRIBUTE extends _MapAttribute> = MapAttribute<
  _MapAttribute extends _MAP_ATTRIBUTE
    ? MapAttributeAttributes
    : {
        [KEY in keyof _MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<
          _MAP_ATTRIBUTE[$attributes][KEY]
        >
      },
  _MAP_ATTRIBUTE[$required],
  _MAP_ATTRIBUTE[$hidden],
  _MAP_ATTRIBUTE[$key],
  _MAP_ATTRIBUTE[$open],
  _MAP_ATTRIBUTE[$savedAs],
  _MAP_ATTRIBUTE[$default]
>
