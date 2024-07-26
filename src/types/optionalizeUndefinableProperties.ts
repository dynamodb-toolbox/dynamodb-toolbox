import type { Optional } from './optional.js'
import type { SelectKeys } from './selectKeys.js'

export type OptionalizeUndefinableProperties<
  OBJECT extends Record<string, unknown>,
  UNDEFINABLE_PROPERTIES_OVERRIDE extends string | number | symbol = never
> = Optional<OBJECT, SelectKeys<OBJECT, undefined> | UNDEFINABLE_PROPERTIES_OVERRIDE>
