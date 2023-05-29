import { isFunction } from 'v1/utils/validation'

import { ComputedDefault, ResolvedAttribute } from '../attributes'

export const isDynamicDefault = (
  defaultValue: ResolvedAttribute | (() => ResolvedAttribute) | ComputedDefault
): defaultValue is () => ResolvedAttribute => isFunction(defaultValue)
