import type { O } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  OnlyOnce,
  Always,
  ResolvePrimitiveAttribute
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type UpdateItemInput<
  SCHEMA extends EntityV2 | Item | Attribute
> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItemInput<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? UpdateItemInput<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [KEY in O.FilterKeys<SCHEMA['attributes'], { required: OnlyOnce }>]: UpdateItemInput<
            SCHEMA['attributes'][KEY]
          >
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<SCHEMA['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
      >
    >
  : SCHEMA extends RecordAttribute
  ? { [KEY in ResolvePrimitiveAttribute<SCHEMA['keys']>]?: UpdateItemInput<SCHEMA['elements']> }
  : SCHEMA extends AnyOfAttribute
  ? UpdateItemInput<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['item']>
  : never
