import { ComputedDefault, ResolvedAttribute } from '../attributes'

export const isComputedDefault = (
  defaultValue: ResolvedAttribute | (() => ResolvedAttribute) | ComputedDefault
): defaultValue is ComputedDefault => defaultValue === ComputedDefault
