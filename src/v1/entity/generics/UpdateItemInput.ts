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
  ResolvePrimitiveAttribute
} from 'v1/schema'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Schema or Attribute
 *
 * @param Schema Entity | Schema | Attribute
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends EntityV2 | Schema | Attribute
> = SCHEMA extends AnyAttribute
  ? unknown
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItemInput<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? UpdateItemInput<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Schema
  ? O.Required<
      O.Partial<
        {
          [KEY in keyof SCHEMA['attributes']]: UpdateItemInput<SCHEMA['attributes'][KEY]>
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<SCHEMA['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA['attributes'], { defaults: { update: undefined } }>
      >
    >
  : SCHEMA extends RecordAttribute
  ? { [KEY in ResolvePrimitiveAttribute<SCHEMA['keys']>]?: UpdateItemInput<SCHEMA['elements']> }
  : SCHEMA extends AnyOfAttribute
  ? UpdateItemInput<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['schema']>
  : never
