import type { A, O, U } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Attribute,
  ResolvedAttribute,
  Any,
  Leaf,
  SetAttribute,
  List,
  Mapped,
  MappedAttributes,
  AtLeastOnce,
  OnlyOnce,
  Always
} from 'v1/item/typers'
import type { PrimaryKey } from 'v1/table'

import type { EntityV2 } from '../class'

/**
 * Swaps the key of a attributes dictionnary for their "savedAs" values if they exist
 * Leave the attribute as is otherwise
 *
 * @param MappedAttributesInput Mapped Attributes
 * @return Mapped Attributes
 * @example
 * SwapWithSavedAs<{ keyA: { ...attribute, _savedAs: "keyB" }}>
 * => { keyB: { ...attribute, _savedAs: "keyB"  }}
 */
type SwapWithSavedAs<MappedAttributesInput extends MappedAttributes> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof MappedAttributesInput]: MappedAttributesInput[K] extends { _savedAs: string }
        ? Record<MappedAttributesInput[K]['_savedAs'], MappedAttributesInput[K]>
        : Record<K, MappedAttributesInput[K]>
    }[keyof MappedAttributesInput]
  >
>

type RecSavedItem<
  Input extends Mapped | Item,
  S extends MappedAttributes = SwapWithSavedAs<Input['_attributes']>
> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [key in keyof S]: SavedItem<S[key]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<S, { _required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have defined default (initial or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<S, { _default: undefined }>
> & // Add Record<string, ResolvedAttribute> if map is open
  (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type SavedItem<Input extends EntityV2 | Item | Attribute> = Input extends Any
  ? ResolvedAttribute
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<SavedItem<Input['_elements']>>
  : Input extends List
  ? SavedItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? RecSavedItem<Input>
  : Input extends EntityV2
  ? SavedItem<Input['item']> & PrimaryKey<Input['table']>
  : never
