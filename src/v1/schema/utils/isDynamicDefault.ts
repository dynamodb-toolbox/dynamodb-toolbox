import { isFunction } from 'v1/utils/validation'

import type { ComputedDefault, AttributeValue } from '../attributes'

export const isDynamicDefault = (
  defaultValue: AttributeValue | (() => AttributeValue) | ComputedDefault
): defaultValue is () => AttributeValue => isFunction(defaultValue)
