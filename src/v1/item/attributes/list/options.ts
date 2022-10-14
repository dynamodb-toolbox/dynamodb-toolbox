import type { AttributeOptions } from '../shared/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of List Attribute
 */
export interface ListAttributeOptions<
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

export const LIST_DEFAULT_OPTIONS: ListAttributeOptions<Never, false, false, undefined, undefined> =
  {
    required: 'never',
    hidden: false,
    key: false,
    savedAs: undefined,
    default: undefined
  }
