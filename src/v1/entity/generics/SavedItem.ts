import type { O } from 'ts-toolbelt'

import type { Schema } from 'v1/schema'
import type {
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  SchemaAttributes,
  RecordAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Always,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  ResolvePrimitiveAttributeType
} from 'v1/schema/attributes'
import type { PrimaryKey } from 'v1/table/actions/parsePrimaryKey'

import type { EntityV2 } from '../entity'

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
type SwapWithSavedAs<MAP_ATTRIBUTE_ATTRIBUTES extends SchemaAttributes> = {
  [ATTRIBUTE_NAME in keyof MAP_ATTRIBUTE_ATTRIBUTES as MAP_ATTRIBUTE_ATTRIBUTES[ATTRIBUTE_NAME]['savedAs'] extends string
    ? MAP_ATTRIBUTE_ATTRIBUTES[ATTRIBUTE_NAME]['savedAs']
    : ATTRIBUTE_NAME]: MAP_ATTRIBUTE_ATTRIBUTES[ATTRIBUTE_NAME]
}

type RecSavedItem<
  SCHEMA extends Schema | MapAttribute,
  SWAPPED_ATTRIBUTES extends SchemaAttributes = SwapWithSavedAs<SCHEMA['attributes']>
> = O.Required<
  Partial<
    {
      // Keep all attributes
      [KEY in keyof SWAPPED_ATTRIBUTES]: SavedItem<SWAPPED_ATTRIBUTES[KEY]>
    }
  >,
  // Enforce Required attributes
  O.SelectKeys<SWAPPED_ATTRIBUTES, { required: AtLeastOnce | Always }>
>

/**
 * Shape of saved item in DynamoDB for a given Entity, Schema or Attribute
 *
 * @param Schema Entity | Schema | Attribute
 * @return Object
 */
export type SavedItem<SCHEMA extends EntityV2 | Schema | Attribute> = SCHEMA extends AnyAttribute
  ? ResolveAnyAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? SCHEMA extends { transform: undefined }
    ? ResolvePrimitiveAttribute<SCHEMA>
    : ResolvePrimitiveAttributeType<SCHEMA['type']>
  : SCHEMA extends SetAttribute
  ? Set<SavedItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? SavedItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Schema
  ? RecSavedItem<SCHEMA>
  : SCHEMA extends RecordAttribute
  ? { [KEY in ResolvePrimitiveAttribute<SCHEMA['keys']>]?: SavedItem<SCHEMA['elements']> }
  : SCHEMA extends AnyOfAttribute
  ? SavedItem<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? SavedItem<SCHEMA['schema']> & PrimaryKey<SCHEMA['table']>
  : never
