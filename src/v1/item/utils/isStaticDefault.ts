import { ComputedDefault, ResolvedLeafType } from '../typers'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: ResolvedLeafType | (() => ResolvedLeafType) | ComputedDefault
): defaultValue is ResolvedLeafType | ComputedDefault => !isDynamicDefault(defaultValue)
