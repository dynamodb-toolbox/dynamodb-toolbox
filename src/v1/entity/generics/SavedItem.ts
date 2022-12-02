import type { A, O, U } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  LeafAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  MapAttributeAttributes,
  _MapAttributeAttributes,
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
type SwapWithSavedAs<MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof MAP_ATTRIBUTE_ATTRIBUTES]: MAP_ATTRIBUTE_ATTRIBUTES[K] extends {
        savedAs: string
      }
        ? Record<MAP_ATTRIBUTE_ATTRIBUTES[K]['savedAs'], MAP_ATTRIBUTE_ATTRIBUTES[K]>
        : Record<K, MAP_ATTRIBUTE_ATTRIBUTES[K]>
    }[keyof MAP_ATTRIBUTE_ATTRIBUTES]
  >
>

type RecSavedItem<
  INPUT extends MapAttribute | Item,
  SWAPPED_ATTRIBUTES extends MapAttributeAttributes = SwapWithSavedAs<INPUT['attributes']>
> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [key in keyof SWAPPED_ATTRIBUTES]: SavedItem<SWAPPED_ATTRIBUTES[key]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<SWAPPED_ATTRIBUTES, { required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have defined default (initial or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<SWAPPED_ATTRIBUTES, { default: undefined }>
> & // Add Record<string, ResolvedAttribute> if map is open
  (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type SavedItem<INPUT extends EntityV2 | Item | Attribute> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends LeafAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<SavedItem<INPUT['elements']>>
  : INPUT extends ListAttribute
  ? SavedItem<INPUT['elements']>[]
  : INPUT extends MapAttribute | Item
  ? RecSavedItem<INPUT>
  : INPUT extends EntityV2
  ? SavedItem<INPUT['item']> & PrimaryKey<INPUT['table']>
  : never
