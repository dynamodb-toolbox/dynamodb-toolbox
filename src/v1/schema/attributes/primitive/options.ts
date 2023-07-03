import type { RequiredOption, AtLeastOnce } from '../constants/requiredOptions'
import { $enum } from '../constants/attributeOptions'

import type {
  PrimitiveAttributeType,
  PrimitiveAttributeDefaultValue,
  PrimitiveAttributeEnumValues
} from './types'

// Note: May sound like a duplicate of AnyAttributeState but actually adds JSDocs

/**
 * Input options of Primitive Attribute
 */
export type PrimitiveAttributeOptions<
  TYPE extends PrimitiveAttributeType = PrimitiveAttributeType
> = {
  /**
   * Tag attribute as required. Possible values are:
   * - `"atLeastOnce"` _(default)_: Required in PUTs, optional in UPDATEs
   * - `"never"`: Optional in PUTs and UPDATEs
   * - `"always"`: Required in PUTs and UPDATEs
   */
  required: RequiredOption
  /**
   * Hide attribute after fetch commands and formatting
   */
  hidden: boolean
  /**
   * Tag attribute as needed for Primary Key computing
   */
  key: boolean
  /**
   * Rename attribute before save commands
   */
  savedAs: string | undefined
  [$enum]: PrimitiveAttributeEnumValues<TYPE>
  /**
   * Provide default values for attribute (or tag attribute as having computed default values)
   */
  defaults: {
    put: PrimitiveAttributeDefaultValue<TYPE>
    update: PrimitiveAttributeDefaultValue<TYPE>
  }
}

export type PrimitiveAttributeDefaultOptions = {
  required: AtLeastOnce
  hidden: false
  key: false
  savedAs: undefined
  [$enum]: undefined
  defaults: {
    put: undefined
    update: undefined
  }
}

export const PRIMITIVE_DEFAULT_OPTIONS: PrimitiveAttributeDefaultOptions = {
  required: 'atLeastOnce',
  hidden: false,
  key: false,
  savedAs: undefined,
  [$enum]: undefined,
  defaults: {
    put: undefined,
    update: undefined
  }
}
