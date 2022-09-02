import type { CommonOptions } from '../common/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of Mapped Property
 */
export interface MappedOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  O extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends CommonOptions<R, H, K, S> {
  /**
   * Accept additional properties of any type
   */
  open: O
  /**
   * Tag property as having a computed default value
   */
  default: D
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
