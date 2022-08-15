import type { ComputedDefault } from '../constants/computedDefault'

export type LeafType = 'string' | 'boolean' | 'number' | 'binary'

export type ResolveLeafType<T extends LeafType> = T extends 'string'
  ? string
  : T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : T extends 'binary'
  ? Buffer
  : never

export type ResolvedLeafType = ResolveLeafType<LeafType>

export type EnumValues<T extends LeafType> = ResolveLeafType<T>[] | undefined

export type LeafDefaultValue<T extends LeafType> =
  | undefined
  | ComputedDefault
  | ResolveLeafType<T>
  | (() => ResolveLeafType<T>)
