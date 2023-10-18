import type { AttributeValue } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (defaultValue: unknown): defaultValue is AttributeValue =>
  !isDynamicDefault(defaultValue)
