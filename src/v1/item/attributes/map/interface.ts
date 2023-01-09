import type { _AttributeProperties, AttributeProperties } from '../shared/interface'
import type { _MapAttributeAttributes, MapAttributeAttributes } from '../types/attribute'
import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { FreezeAttribute } from '../freeze'

// TODO: Add false saveAs option
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
  _type: 'map'
  _attributes: ATTRIBUTES
  _open: IS_OPEN
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
  required: <NEXT_REQUIRED extends RequiredOption = AtLeastOnce>(
    nextRequired?: NEXT_REQUIRED
  ) => _MapAttribute<ATTRIBUTES, NEXT_REQUIRED, IS_HIDDEN, IS_KEY, IS_OPEN, SAVED_AS, DEFAULT>
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
        [key in keyof _MAP_ATTRIBUTE['_attributes']]: FreezeAttribute<
          _MAP_ATTRIBUTE['_attributes'][key]
        >
      },
  _MAP_ATTRIBUTE['_required'],
  _MAP_ATTRIBUTE['_hidden'],
  _MAP_ATTRIBUTE['_key'],
  _MAP_ATTRIBUTE['_open'],
  _MAP_ATTRIBUTE['_savedAs'],
  _MAP_ATTRIBUTE['_default']
>
