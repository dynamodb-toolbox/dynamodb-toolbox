import { ComputedDefault, ResolvedAttribute } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: ResolvedAttribute | (() => ResolvedAttribute) | ComputedDefault
): defaultValue is ResolvedAttribute | ComputedDefault => !isDynamicDefault(defaultValue)
