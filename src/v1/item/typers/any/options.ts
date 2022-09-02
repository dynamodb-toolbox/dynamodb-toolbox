import type { CommonOptions } from '../common/options'
import type { RequiredOption, Never } from '../constants/requiredOptions'

import type { AnyDefaultValue } from './types'

/**
 * Input options of Any Property
 */
export interface AnyOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends AnyDefaultValue = AnyDefaultValue
> extends CommonOptions<R, H, K, S> {
  /**
   * Provide a default value for property, or tag property as having a computed default value
   */
  default: D
}

export const anyDefaultOptions: AnyOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
