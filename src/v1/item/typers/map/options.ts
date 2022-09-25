import type { PropertyOptions } from '../property/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of Mapped Property
 */
export interface MappedOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  IsOpen extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  /**
   * Accept additional properties of any type
   */
  open: IsOpen
  /**
   * Tag property as having a computed default value
   */
  default: Default
}

export const mappedDefaultOptions: MappedOptions<
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
