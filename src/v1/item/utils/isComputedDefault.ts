import { ComputedDefault, ResolvedPrimitiveAttributeType } from '../attributes'

export const isComputedDefault = (
  defaultValue:
    | ResolvedPrimitiveAttributeType
    | (() => ResolvedPrimitiveAttributeType)
    | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
