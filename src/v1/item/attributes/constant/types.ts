import type { ComputedDefault } from '../constants/computedDefault'
import { ResolvedAttribute } from '../types'

/**
 * Constant Default values constraint
 */
export type ConstantAttributeDefaultValue<VALUE extends ResolvedAttribute = ResolvedAttribute> =
  | undefined
  | ComputedDefault
  | VALUE
  | (() => VALUE)
