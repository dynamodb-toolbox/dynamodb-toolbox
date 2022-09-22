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
 * @param MappedPropertiesInput Mapped Properties
 * @return Mapped Properties
 * @example
 * SwapWithSavedAs<{ keyA: { ...property, _savedAs: "keyB" }}>
 * => { keyB: { ...property, _savedAs: "keyB"  }}
 */
type SwapWithSavedAs<MappedPropertiesInput extends MappedProperties> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof MappedPropertiesInput]: MappedPropertiesInput[K] extends { _savedAs: string }
        ? Record<MappedPropertiesInput[K]['_savedAs'], MappedPropertiesInput[K]>
        : Record<K, MappedPropertiesInput[K]>
    }[keyof MappedPropertiesInput]
  >
>

type RecSavedItem<
  Input extends Mapped | Item,
  S extends MappedProperties = SwapWithSavedAs<Input['_properties']>
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
  (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @return Object
 */
export type SavedItem<Input extends EntityV2 | Item | Property> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? SavedItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? RecSavedItem<Input>
  : Input extends EntityV2
  ? SavedItem<Input['item']> & PrimaryKey<Input['table']>
  : never
