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
  AtLeastOnce,
  OnlyOnce,
  Always
} from 'v1/item'

import { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type FormattedItem<INPUT extends EntityV2 | Item | Attribute> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends PrimitiveAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<FormattedItem<INPUT['elements']>>
  : INPUT extends ListAttribute
  ? FormattedItem<INPUT['elements']>[]
  : INPUT extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden attributes
          [key in O.SelectKeys<INPUT['attributes'], { hidden: false }>]: FormattedItem<
            INPUT['attributes'][key]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<INPUT['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<INPUT['attributes'], { default: undefined }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? FormattedItem<INPUT['item']>
  : never
