import type { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'
import type { FreezeAttribute } from '../freeze'
import type { AttributeProperties, FrozenAttributeProperties } from '../shared/interface'

import type { ListAttributeElements, FrozenListAttributeElements } from './types'

/**
 * List attribute interface
 */
export interface _ListAttribute<
  Elements extends ListAttributeElements = ListAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  _type: 'list'
  _elements: Elements
  _default: Default
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   * - `"onlyOnce"`: Required in PUTs, denied in UPDATEs
   *
   * @param nextRequired RequiredOption
   */
  required: <NextRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextRequired
  ) => _ListAttribute<Elements, NextRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => _ListAttribute<Elements, IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => _ListAttribute<Elements, IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => _ListAttribute<Elements, IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Tag attribute as having a computed default value
   *
   * @param nextDefaultValue `ComputedDefault`
   */
  default: <NextDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextDefault
  ) => _ListAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, NextDefault>
}

export interface FrozenListAttribute<
  Elements extends FrozenListAttributeElements = FrozenListAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends FrozenAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> {
  type: 'list'
  elements: Elements
  default: Default
  path: string
}

export type FreezeListAttribute<Attribute extends _ListAttribute> = FrozenListAttribute<
  FreezeAttribute<Attribute['_elements']>,
  Attribute['_required'],
  Attribute['_hidden'],
  Attribute['_key'],
  Attribute['_savedAs'],
  Attribute['_default']
>
