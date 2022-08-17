import type { ComputedDefault } from '../constants/computedDefault'
import type { ResolvedProperty } from '../types/property'

/**
 * Any Default values constraint
 */
export type AnyDefaultValue =
  | undefined
  | ComputedDefault
  | ResolvedProperty
  | (() => ResolvedProperty)
