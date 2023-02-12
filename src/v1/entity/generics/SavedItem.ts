import type { O, U } from 'ts-toolbelt'

import {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  ConstantAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  MapAttributeAttributes,
  AnyOfAttribute,
  AtLeastOnce,
  OnlyOnce,
  Always,
  ResolveConstantAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'
import type { PrimaryKey } from 'v1/table'

import { EntityV2 } from '../class'

/**
 * Swaps the key of a attributes dictionnary for their "savedAs" values if they exist
 * Leave the attribute as is otherwise
 *
 * @param MapAttributeAttributesInput MapAttribute Attributes
 * @return MapAttribute Attributes
 * @example
 * SwapWithSavedAs<{ keyA: { ...attribute, savedAs: "keyB" }}>
 * => { keyB: { ...attribute, savedAs: "keyB"  }}
 */
type SwapWithSavedAs<MAP_ATTRIBUTE_ATTRIBUTES extends MapAttributeAttributes> = Extract<
  U.IntersectOf<
    {
      [KEY in keyof MAP_ATTRIBUTE_ATTRIBUTES]: MAP_ATTRIBUTE_ATTRIBUTES[KEY] extends {
        savedAs: string
      }
        ? Record<MAP_ATTRIBUTE_ATTRIBUTES[KEY]['savedAs'], MAP_ATTRIBUTE_ATTRIBUTES[KEY]>
        : Record<KEY, MAP_ATTRIBUTE_ATTRIBUTES[KEY]>
    }[keyof MAP_ATTRIBUTE_ATTRIBUTES]
  >,
  MapAttributeAttributes
>

type RecSavedItem<
  SCHEMA extends MapAttribute | Item,
  SWAPPED_ATTRIBUTES extends MapAttributeAttributes = SwapWithSavedAs<SCHEMA['attributes']>
> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [KEY in keyof SWAPPED_ATTRIBUTES]: SavedItem<SWAPPED_ATTRIBUTES[KEY]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<SWAPPED_ATTRIBUTES, { required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have defined default (hard or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<SWAPPED_ATTRIBUTES, { default: undefined }>
> & // Add Record<string, ResolvedAttribute> if map is open
  (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : unknown)

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type SavedItem<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? ResolveConstantAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<SavedItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? SavedItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? RecSavedItem<SCHEMA>
  : SCHEMA extends AnyOfAttribute
  ? SavedItem<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? SavedItem<SCHEMA['item']> & PrimaryKey<SCHEMA['table']>
  : never
