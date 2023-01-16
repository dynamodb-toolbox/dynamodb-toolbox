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
  Always
} from 'v1/item'

import { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type FormattedItem<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends ConstantAttribute
  ? SCHEMA['value']
  : SCHEMA extends PrimitiveAttribute
  ? NonNullable<SCHEMA['resolved']>
  : SCHEMA extends SetAttribute
  ? Set<FormattedItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? FormattedItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden attributes
          [key in O.SelectKeys<SCHEMA['attributes'], { hidden: false }>]: FormattedItem<
            SCHEMA['attributes'][key]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have defined default (hard or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (SCHEMA extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : SCHEMA extends EntityV2
  ? FormattedItem<SCHEMA['item']>
  : never
