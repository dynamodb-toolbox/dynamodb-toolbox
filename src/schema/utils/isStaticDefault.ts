import type { SchemaExtendedValue } from '~/schema/index.js'

import { isDynamicDefault } from './isDynamicDefault.js'

/**
 * Whether a default value is a static (non-function) value.
 */
export const isStaticDefault = (defaultValue: unknown): defaultValue is SchemaExtendedValue =>
  !isDynamicDefault(defaultValue)
