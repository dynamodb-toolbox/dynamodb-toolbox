import { ComputedDefault, ResolvedPrimitiveAttributeType } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue:
    | ResolvedPrimitiveAttributeType
    | (() => ResolvedPrimitiveAttributeType)
    | ComputedDefault
): defaultValue is ResolvedPrimitiveAttributeType | ComputedDefault =>
  !isDynamicDefault(defaultValue)
