import { ComputedDefault, AttributeValue } from '../attributes'

export const isComputedDefault = (
  defaultValue: AttributeValue | ComputedDefault | (() => unknown)
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
