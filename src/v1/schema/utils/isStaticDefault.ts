import type { ComputedDefault, AttributeValue } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: AttributeValue | (() => AttributeValue) | ComputedDefault
): defaultValue is AttributeValue | ComputedDefault => !isDynamicDefault(defaultValue)
