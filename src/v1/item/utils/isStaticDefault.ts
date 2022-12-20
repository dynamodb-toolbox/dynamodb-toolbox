import { ComputedDefault, ResolvedPrimitiveAttribute } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: ResolvedPrimitiveAttribute | (() => ResolvedPrimitiveAttribute) | ComputedDefault
): defaultValue is ResolvedPrimitiveAttribute | ComputedDefault => !isDynamicDefault(defaultValue)
