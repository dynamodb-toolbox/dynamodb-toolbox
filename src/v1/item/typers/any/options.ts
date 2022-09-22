import type { PropertyOptions } from '../property/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

/**
 * Input options of Any Property
 */
export interface AnyOptions<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends AnyDefaultValue = AnyDefaultValue
> extends PropertyOptions<Required, Hidden, Key, SavedAs> {
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
