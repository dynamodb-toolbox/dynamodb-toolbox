import type { SchemaExtendedValue } from '~/attributes/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

export const isDynamicDefault = (
  defaultValue: unknown
): defaultValue is (input?: unknown) => SchemaExtendedValue => isFunction(defaultValue)
