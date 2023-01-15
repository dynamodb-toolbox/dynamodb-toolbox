import type { AttributeOptions } from '../shared/options'
import { ComputedDefault, RequiredOption, AtLeastOnce } from '../constants'

/**
 * Input options of MapAttribute Attribute
 */
export interface MapAttributeOptions<
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  IS_OPEN extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ComputedDefault | undefined = ComputedDefault | undefined
> extends AttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  /**
   * Accept additional attributes of any type
   */
  open: IS_OPEN
  /**
   * Tag attribute as having a computed default value
   */
  default: DEFAULT
}

export const MAPPED_DEFAULT_OPTIONS: MapAttributeOptions<
  AtLeastOnce,
  false,
  false,
  false,
  undefined,
  undefined
> = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  open: false,
  savedAs: undefined,
  default: undefined
}
