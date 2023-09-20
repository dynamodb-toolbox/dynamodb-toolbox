import { isFunction } from 'v1/utils/validation'

import type { ComputedDefault, AttributeValue } from '../attributes'

export const isDynamicDefault = (
  defaultValue: AttributeValue | ComputedDefault | (() => unknown)
): defaultValue is () => AttributeValue => isFunction(defaultValue)
