import { isFunction } from 'v1/utils/validation'

import type { AttributeValue } from '../attributes'

export const isDynamicDefault = (
  defaultValue: unknown
): defaultValue is (input?: unknown) => AttributeValue => isFunction(defaultValue)
