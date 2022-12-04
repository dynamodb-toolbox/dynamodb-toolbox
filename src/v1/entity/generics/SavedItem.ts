import type { A, O, U } from 'ts-toolbelt'

import type {
  FrozenItem,
  FrozenAttribute,
  ResolvedAttribute,
  FrozenAnyAttribute,
  FrozenLeafAttribute,
  FrozenSetAttribute,
  FrozenListAttribute,
  FrozenMapAttribute,
  FrozenMapAttributeAttributes,
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
type SwapWithSavedAs<MapAttributeAttributesInput extends FrozenMapAttributeAttributes> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof MapAttributeAttributesInput]: MapAttributeAttributesInput[K] extends {
        savedAs: string
      }
        ? Record<MapAttributeAttributesInput[K]['savedAs'], MapAttributeAttributesInput[K]>
        : Record<K, MapAttributeAttributesInput[K]>
    }[keyof MapAttributeAttributesInput]
  >
>

type RecSavedItem<
  Input extends FrozenMapAttribute | FrozenItem,
  S extends FrozenMapAttributeAttributes = SwapWithSavedAs<Input['attributes']>
> = O.Required<
  O.Partial<
    {
      // Keep all attributes
      [key in keyof S]: SavedItem<S[key]>
    }
  >,
  // Enforce Required attributes
  | O.SelectKeys<S, { required: AtLeastOnce | OnlyOnce | Always }>
  // Enforce attributes that have defined default (initial or computed)
  // (...but not so sure about that anymore, props can have computed default but still be optional)
  | O.FilterKeys<S, { default: undefined }>
> & // Add Record<string, ResolvedAttribute> if map is open
  (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})

/**
 * Shape of saved item in DynamoDB for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type SavedItem<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<SavedItem<Input['elements']>>
  : Input extends FrozenListAttribute
  ? SavedItem<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? RecSavedItem<Input>
  : Input extends EntityV2
  ? SavedItem<Input['frozenItem']> & PrimaryKey<Input['table']>
  : never
