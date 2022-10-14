import type { A, O, U } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  LeafAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  MapAttributeAttributes,
  AtLeastOnce,
  OnlyOnce,
  Always
} from 'v1/item'
import type { PrimaryKey } from 'v1/table'

import type { EntityV2 } from '../class'

/**
 * Swaps the key of a attributes dictionnary for their "savedAs" values if they exist
 * Leave the attribute as is otherwise
 *
 * @param MapAttributeAttributesInput MapAttribute Attributes
 * @return MapAttribute Attributes
 * @example
 * SwapWithSavedAs<{ keyA: { ...attribute, _savedAs: "keyB" }}>
 * => { keyB: { ...attribute, _savedAs: "keyB"  }}
 */
type SwapWithSavedAs<MapAttributeAttributesInput extends MapAttributeAttributes> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof MapAttributeAttributesInput]: MapAttributeAttributesInput[K] extends {
        _savedAs: string
      }
        ? Record<MapAttributeAttributesInput[K]['_savedAs'], MapAttributeAttributesInput[K]>
        : Record<K, MapAttributeAttributesInput[K]>
    }[keyof MapAttributeAttributesInput]
  >
>

type RecSavedItem<
  Input extends MapAttribute | Item,
  S extends MapAttributeAttributes = SwapWithSavedAs<Input['_attributes']>
> = O.Required<
  O.Partial<{
    // Keep all attributes
    [key in keyof S]: SavedItem<S[key]>
  }>,
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
export type SavedItem<Input extends EntityV2 | Item | Attribute> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<SavedItem<Input['_elements']>>
  : Input extends ListAttribute
  ? SavedItem<Input['_elements']>[]
  : Input extends MapAttribute | Item
  ? RecSavedItem<Input>
  : Input extends EntityV2
  ? SavedItem<Input['item']> & PrimaryKey<Input['table']>
  : never
