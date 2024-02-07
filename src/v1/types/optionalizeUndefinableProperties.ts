import type { O } from 'ts-toolbelt'

import type { Optional } from './optional'

export type OptionalizeUndefinableProperties<
  OBJECT extends Record<string, unknown>,
  UNDEFINABLE_PROPERTIES_OVERRIDE extends string = never
> = Optional<OBJECT, O.SelectKeys<OBJECT, undefined> | UNDEFINABLE_PROPERTIES_OVERRIDE>
