import { ComputedDefault, ResolvedPrimitiveAttribute } from '../attributes'

export const isComputedDefault = (
  defaultValue: ResolvedPrimitiveAttribute | (() => ResolvedPrimitiveAttribute) | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
