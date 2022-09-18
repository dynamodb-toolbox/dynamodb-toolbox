import { ComputedDefault, ResolvedLeafType } from '../typers'

export const isComputedDefault = (
  defaultValue: ResolvedLeafType | (() => ResolvedLeafType) | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
