import type { AttributeOptions } from '../shared/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of MapAttribute Attribute
 */
export interface MapAttributeOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  /**
   * Accept additional attributes of any type
   */
  open: IsOpen
  /**
   * Tag attribute as having a computed default value
   */
  default: Default
}

export const MAPPED_DEFAULT_OPTIONS: MapAttributeOptions<
  Never,
  false,
  false,
  false,
  undefined,
  undefined
> = {
  required: 'never',
  hidden: false,
  key: false,
  open: false,
  savedAs: undefined,
  default: undefined
}
