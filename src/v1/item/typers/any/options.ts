import type { PropertyOptions } from '../property/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

/**
 * Input options of Any Property
 */
export interface AnyOptions<
  IsRequired extends RequiredOption = RequiredOption,
  IsHidden extends boolean = boolean,
  IsKey extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends PropertyOptions<IsRequired, IsHidden, IsKey, SavedAs> {
  /**
   * Provide a default value for property, or tag property as having a computed default value
   */
  default: Default
}

export const anyDefaultOptions: AnyOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
