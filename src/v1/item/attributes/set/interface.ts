import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import type { ComputedDefault } from '../constants/computedDefault'
import type { AttributeProperties, FrozenAttributeProperties } from '../shared/interface'
import type { FreezeAttribute } from '../freeze'
import type { SetAttributeElements, FrozenSetAttributeElements } from './types'

/**
 * Set attribute interface
 */
export type SetAttribute<
  Elements extends SetAttributeElements = SetAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> = AttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> & {
  _type: 'set'
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
  required: <NextIsRequired extends RequiredOption = AtLeastOnce>(
    nextRequired?: NextIsRequired
  ) => SetAttribute<Elements, NextIsRequired, IsHidden, IsKey, SavedAs, Default>
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: () => SetAttribute<Elements, IsRequired, true, IsKey, SavedAs, Default>
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: () => SetAttribute<Elements, IsRequired, IsHidden, true, SavedAs, Default>
  /**
   * Rename attribute before save commands
   */
  savedAs: <NextSavedAs extends string | undefined>(
    nextSavedAs: NextSavedAs
  ) => SetAttribute<Elements, IsRequired, IsHidden, IsKey, NextSavedAs, Default>
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   *
   * @param nextDefaultValue `Attribute type`, `() => Attribute type`, `ComputedDefault`
   */
  default: <NextDefault extends ComputedDefault | undefined>(
    nextDefaultValue: NextDefault
  ) => SetAttribute<Elements, IsRequired, IsHidden, IsKey, SavedAs, NextDefault>
}

export type FrozenSetAttribute<
  Elements extends FrozenSetAttributeElements = FrozenSetAttributeElements,
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> = FrozenAttributeProperties<IsRequired, IsHidden, IsKey, SavedAs> & {
  type: 'set'
  path: string
  elements: Elements
  default: Default
}

export type FreezeSetAttribute<Attribute extends SetAttribute> = FrozenSetAttribute<
  FreezeAttribute<Attribute['_elements']>,
  Attribute['_required'],
  Attribute['_hidden'],
  Attribute['_key'],
  Attribute['_savedAs'],
  Attribute['_default']
>
