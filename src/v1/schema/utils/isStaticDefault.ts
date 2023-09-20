import type { ComputedDefault, AttributeValue } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: AttributeValue | ComputedDefault | (() => unknown)
): defaultValue is AttributeValue | ComputedDefault => !isDynamicDefault(defaultValue)
