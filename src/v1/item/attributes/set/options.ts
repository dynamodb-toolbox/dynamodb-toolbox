import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'
import { ComputedDefault } from '../constants/computedDefault'

/**
 * Input options of Set Attribute
 */
export interface SetAttributeOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  /**
   * Tag attribute as having a computed default value
   */
  default: Default
}

export const SET_ATTRIBUTE_DEFAULT_OPTIONS: SetAttributeOptions<
  Never,
  false,
  false,
  undefined,
  undefined
> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
