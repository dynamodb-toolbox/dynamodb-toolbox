import { isFunction } from 'v1/utils/validation'

import { ComputedDefault, ResolvedPrimitiveAttributeType } from '../attributes'

export const isDynamicDefault = (
  defaultValue:
    | ResolvedPrimitiveAttributeType
    | (() => ResolvedPrimitiveAttributeType)
    | ComputedDefault
): defaultValue is () => ResolvedPrimitiveAttributeType => isFunction(defaultValue)
