import type { A, O, U } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
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
} from 'v1/item/typers'
import type { PrimaryKey } from 'v1/table'

import type { EntityV2 } from '../class'

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

type RecSavedItem<
  P extends Mapped | Item,
  S extends MappedProperties = SwapWithSavedAs<P['_properties']>
> = O.Required<
  O.Partial<
    {
      // Keep all properties
      [key in keyof S]: SavedItem<S[key]>
    }
  >,
  // Enforce Required properties
  | O.SelectKeys<S, { _required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce properties that have defined default (initial or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<S, { _default: undefined }>
> & // Add Record<string, ResolvedProperty> if map is open
  (P extends { _open: true } ? Record<string, ResolvedProperty> : {})

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Property
 *
 * @param E Entity | Item | Property
 * @return Object
 */
export type SavedItem<E extends EntityV2 | Item | Property> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? SavedItem<E['_elements']>[]
  : E extends Mapped | Item
  ? RecSavedItem<E>
  : E extends EntityV2
  ? SavedItem<E['item']> & PrimaryKey<E['table']>
  : never
