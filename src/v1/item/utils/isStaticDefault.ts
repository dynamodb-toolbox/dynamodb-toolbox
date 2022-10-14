import { ComputedDefault, ResolvedLeafAttributeType } from '../attributes'
import { isDynamicDefault } from './isDynamicDefault'

export const isStaticDefault = (
  defaultValue: ResolvedLeafAttributeType | (() => ResolvedLeafAttributeType) | ComputedDefault
): defaultValue is ResolvedLeafAttributeType | ComputedDefault => !isDynamicDefault(defaultValue)
