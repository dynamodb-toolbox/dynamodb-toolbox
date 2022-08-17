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

/**
 * Swaps the key of a properties dictionnary for their "savedAs" values if they exist
 * Leave the property as is otherwise
 *
 * @param O Mapped Properties
 * @return Mapped Properties
 * @example
 * SwapWithSavedAs<{ keyA: { ...property, _savedAs: "keyB" }}>
 * => { keyB: { ...property, _savedAs: "keyB"  }}
 */
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
    // Keep all properties
    [key in keyof S]: ItemSavedAs<S[key]>
  }>,
  // Enforce Required properties
  | O.SelectKeys<S, { _required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce properties that have defined default (initial or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<S, { _default: undefined }>
> & // Add Record<string, ResolvedProperty> if map is open
  (P extends { _open: true } ? Record<string, ResolvedProperty> : {})

/**
 * Shape of saved value in DynamoDB for a given Item or Property (recursive)
 *
 * @param I Item / Property
 * @return Type
 */
export type ItemSavedAs<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemSavedAs<P['_elements']>[]
  : P extends Mapped | Item
  ? ItemRecSavedAs<P>
  : never
