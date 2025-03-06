import type { SchemaExtendedValue } from '~/schema/index.js'

import { isDynamicDefault } from './isDynamicDefault.js'

export const isStaticDefault = (defaultValue: unknown): defaultValue is SchemaExtendedValue =>
  !isDynamicDefault(defaultValue)
