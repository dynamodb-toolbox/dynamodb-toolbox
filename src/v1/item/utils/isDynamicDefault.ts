import { isFunction } from 'v1/utils/validation'

import { ComputedDefault, ResolvedLeafAttributeType } from '../attributes'

export const isDynamicDefault = (
  defaultValue: ResolvedLeafAttributeType | (() => ResolvedLeafAttributeType) | ComputedDefault
): defaultValue is () => ResolvedLeafAttributeType => isFunction(defaultValue)
