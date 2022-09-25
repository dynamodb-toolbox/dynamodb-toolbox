import type { ComputedDefault } from '../constants/computedDefault'
import type { ResolvedAttribute } from '../types/attribute'

/**
 * Any Default values constraint
 */
export type AnyDefaultValue =
  | undefined
  | ComputedDefault
  | ResolvedAttribute
  | (() => ResolvedAttribute)
