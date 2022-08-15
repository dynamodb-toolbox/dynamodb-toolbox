import type { A, O, U } from 'ts-toolbelt'

import type { Item } from '../interface'
import type {
  MappedProperties,
  Property,
  ResolvedProperty,
  Leaf,
  Mapped,
  List,
  Any,
  AtLeastOnce,
  OnlyOnce,
  Always
} from '../typers'

type SwapWithSavedAs<O extends MappedProperties> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof O]: O[K] extends { _savedAs: string }
        ? Record<O[K]['_savedAs'], O[K]>
        : Record<K, O[K]>
    }[keyof O]
  >
>

type ItemRecSavedAs<
  P extends Mapped | Item,
  S extends MappedProperties = SwapWithSavedAs<P['_properties']>
> = O.Required<
  O.Partial<{
    [key in keyof S]: ItemSavedAs<S[key]>
  }>,
  // required props will necessarily be present
  | O.SelectKeys<S, { _required: AtLeastOnce | OnlyOnce | Always }>
  // props that have defined default (initial or computed) will necessarily be present
  | O.FilterKeys<S, { _default: undefined }>
> &
  (P extends { _open: true } ? Record<string, ResolvedProperty> : {})

export type ItemSavedAs<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemSavedAs<P['_elements']>[]
  : P extends Mapped | Item
  ? ItemRecSavedAs<P>
  : never
