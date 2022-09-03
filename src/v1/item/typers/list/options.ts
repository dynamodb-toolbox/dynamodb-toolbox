import type { PropertyOptions } from '../property/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of List Property
 */
export interface ListOptions<
  R extends RequiredOption = RequiredOption,
  H extends boolean = boolean,
  K extends boolean = boolean,
  S extends string | undefined = string | undefined,
  D extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyOptions<R, H, K, S> {
  /**
   * Tag property as having a computed default value
   */
  default: D
}

export const listDefaultOptions: ListOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
