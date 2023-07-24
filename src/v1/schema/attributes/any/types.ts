import type { ComputedDefault } from '../constants/computedDefault'
import type { AttributeValue } from '../types/attribute'

/**
 * Any Default values constraint
 */
export type AnyAttributeDefaultValue =
  | undefined
  | ComputedDefault
  | AttributeValue
  | (() => AttributeValue)
