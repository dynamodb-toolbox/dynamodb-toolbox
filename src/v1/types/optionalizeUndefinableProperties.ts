import type { O } from 'ts-toolbelt'

export type OptionalizeUndefinableProperties<
  OBJECT extends Record<string, unknown>,
  UNDEFINABLE_PROPERTIES_OVERRIDE extends string = never
> = O.Optional<OBJECT, O.SelectKeys<OBJECT, undefined> | UNDEFINABLE_PROPERTIES_OVERRIDE>
