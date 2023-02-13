import type { O } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  ConstantAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  AnyOfAttribute,
  OnlyOnce,
  Always,
  ComputedDefault,
  ResolveConstantAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type UpdateItem<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? ResolveConstantAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<UpdateItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? UpdateItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<SCHEMA['attributes'], { required: OnlyOnce }>]: UpdateItem<
            SCHEMA['attributes'][key]
          >
        }
      >,
      // Enforce Always Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : unknown)
  : SCHEMA extends AnyOfAttribute
  ? UpdateItem<SCHEMA['elements'][number]>
  : SCHEMA extends EntityV2
  ? UpdateItem<SCHEMA['item']>
  : never
