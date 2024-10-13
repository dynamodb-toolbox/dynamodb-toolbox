import type { Optional } from './optional.js'
import type { SelectKeys } from './selectKeys.js'

// TODO: Remove and use Optional<TYPE, KEYS> everywhere instead
export type OptionalizeUndefinableProperties<
  OBJECT extends Record<string, unknown>,
  UNDEFINABLE_PROPERTIES_OVERRIDE extends string | number | symbol = never
> = Optional<OBJECT, SelectKeys<OBJECT, undefined> | UNDEFINABLE_PROPERTIES_OVERRIDE>
