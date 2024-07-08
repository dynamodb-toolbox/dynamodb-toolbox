import type { AttributeValue } from '~/attributes/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

export const isDynamicDefault = (
  defaultValue: unknown
): defaultValue is (input?: unknown) => AttributeValue => isFunction(defaultValue)
