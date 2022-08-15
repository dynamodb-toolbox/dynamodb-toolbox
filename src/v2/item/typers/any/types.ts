import type { ComputedDefault } from '../constants/computedDefault'
import type { ResolvedProperty } from '../types/property'

export type AnyDefaultValue =
  | undefined
  | ComputedDefault
  | ResolvedProperty
  | (() => ResolvedProperty)
