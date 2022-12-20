import { isFunction } from 'v1/utils/validation'

import { ComputedDefault, ResolvedPrimitiveAttribute } from '../attributes'

export const isDynamicDefault = (
  defaultValue: ResolvedPrimitiveAttribute | (() => ResolvedPrimitiveAttribute) | ComputedDefault
): defaultValue is () => ResolvedPrimitiveAttribute => isFunction(defaultValue)
