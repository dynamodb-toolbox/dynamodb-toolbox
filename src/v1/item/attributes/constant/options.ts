import type { AttributeOptions } from '../shared/options'
import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { ResolvedAttribute } from '../types'

import type { ConstantAttributeDefaultValue } from './types'

/**
 * Input options of Const Attribute
 */
export interface ConstAttributeOptions<
  VALUE extends ResolvedAttribute = ResolvedAttribute,
  IS_REQUIRED extends RequiredOption = RequiredOption,
  IS_HIDDEN extends boolean = boolean,
  IS_KEY extends boolean = boolean,
  SAVED_AS extends string | undefined = string | undefined,
  DEFAULT extends ConstantAttributeDefaultValue<VALUE> = ConstantAttributeDefaultValue<VALUE>
> extends AttributeOptions<IS_REQUIRED, IS_HIDDEN, IS_KEY, SAVED_AS> {
  /**
   * Provide a default value for attribute, or tag attribute as having a computed default value
   */
  default: DEFAULT
}

export const CONST_DEFAULT_OPTIONS: ConstAttributeOptions<
  ResolvedAttribute,
  AtLeastOnce,
  false,
  false,
  undefined,
  undefined
> = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  default: undefined
}
