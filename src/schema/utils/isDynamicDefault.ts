import type { SchemaExtendedValue } from '~/schema/index.js'
import { isFunction } from '~/utils/validation/isFunction.js'

/**
 * Whether a default value is a function computed at runtime.
 */
export const isDynamicDefault = (
  defaultValue: unknown
): defaultValue is (input?: unknown) => SchemaExtendedValue => isFunction(defaultValue)
