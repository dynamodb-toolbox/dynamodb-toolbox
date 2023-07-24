import { ComputedDefault, AttributeValue } from '../attributes'

export const isComputedDefault = (
  defaultValue: AttributeValue | (() => AttributeValue) | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
