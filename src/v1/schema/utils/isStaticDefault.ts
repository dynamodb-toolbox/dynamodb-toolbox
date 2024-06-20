import type { AttributeValue } from '../attributes/index.js'
import { isDynamicDefault } from './isDynamicDefault.js'

export const isStaticDefault = (defaultValue: unknown): defaultValue is AttributeValue =>
  !isDynamicDefault(defaultValue)
