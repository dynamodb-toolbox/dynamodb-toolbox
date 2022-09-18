import { isFunction } from 'v1/utils/validation'
import { ComputedDefault, ResolvedLeafType } from '../typers'

export const isDynamicDefault = (
  defaultValue: ResolvedLeafType | (() => ResolvedLeafType) | ComputedDefault
): defaultValue is () => ResolvedLeafType => isFunction(defaultValue)
