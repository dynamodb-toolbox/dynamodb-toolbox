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
  OnlyOnce,
  Always
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
  ? NonNullable<SCHEMA['resolved']>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItemInput<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? UpdateItemInput<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<SCHEMA['attributes'], { required: OnlyOnce }>]: UpdateItemInput<
            SCHEMA['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<SCHEMA['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : SCHEMA extends EntityV2
  ? UpdateItemInput<SCHEMA['item']>
  : never
