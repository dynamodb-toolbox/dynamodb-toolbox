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
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type PutItem<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? SCHEMA['value']
  : SCHEMA extends PrimitiveAttribute
  ? NonNullable<SCHEMA['resolved']>
  : SCHEMA extends ConstantAttribute
  ? NonNullable<SCHEMA['value']>
  : SCHEMA extends SetAttribute
  ? Set<PutItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? PutItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof SCHEMA['attributes']]: PutItem<SCHEMA['attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have hard default
      | O.FilterKeys<SCHEMA['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : unknown)
  : SCHEMA extends EntityV2
  ? PutItem<SCHEMA['item']>
  : never
