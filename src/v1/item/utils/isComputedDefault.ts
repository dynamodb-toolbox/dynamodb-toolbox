import { ComputedDefault, ResolvedLeafAttributeType } from '../attributes'

export const isComputedDefault = (
  defaultValue: ResolvedLeafAttributeType | (() => ResolvedLeafAttributeType) | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
