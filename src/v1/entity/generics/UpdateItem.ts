import type { O } from 'ts-toolbelt'

import type {
  Schema,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Always,
  ComputedDefault,
  ResolvePrimitiveAttribute
} from 'v1/schema'

import type { EntityV2 } from '../class'

/**
 * Formatted input of an UPDATE command for a given Entity, Schema or Attribute
 *
 * @param Schema Entity | Schema | Attribute
 * @return Object
 */
export type UpdateItem<SCHEMA extends EntityV2 | Schema | Attribute> = SCHEMA extends AnyAttribute
  ? unknown
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? UpdateItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Schema
  ? O.Required<
      O.Partial<
        {
          [KEY in keyof SCHEMA['attributes']]: UpdateItem<SCHEMA['attributes'][KEY]>
        }
      >,
      // Enforce Always Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<SCHEMA['attributes'], { defaults: { update: undefined | ComputedDefault } }>
    >
  : SCHEMA extends RecordAttribute
  ? { [KEY in ResolvePrimitiveAttribute<SCHEMA['keys']>]?: UpdateItem<SCHEMA['elements']> }
  : SCHEMA extends AnyOfAttribute
  ? UpdateItem<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? UpdateItem<SCHEMA['schema']>
  : never
