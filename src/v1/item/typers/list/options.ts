import type { PropertyOptions } from '../property/options'
import { ComputedDefault, RequiredOption, Never } from '../constants'

/**
 * Input options of List Property
 */
export interface ListOptions<
  Required extends RequiredOption = RequiredOption,
  Hidden extends boolean = boolean,
  Key extends boolean = boolean,
  SavedAs extends string | undefined = string | undefined,
  Default extends ComputedDefault | undefined = ComputedDefault | undefined
> extends PropertyOptions<Required, Hidden, Key, SavedAs> {
  /**
   * Tag property as having a computed default value
   */
  default: Default
}

export const listDefaultOptions: ListOptions<Never, false, false, undefined, undefined> = {
  required: 'never',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
