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
  AtLeastOnce,
  OnlyOnce,
  Always,
  ResolvePrimitiveAttribute
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity, Item or Attribute
 *
 * @param Schema Entity | Item | Attribute
 * @return Object
 */
export type FormattedItem<SCHEMA extends EntityV2 | Item | Attribute> = SCHEMA extends AnyAttribute
  ? ResolvedAttribute
  : SCHEMA extends PrimitiveAttribute
  ? ResolvePrimitiveAttribute<SCHEMA>
  : SCHEMA extends SetAttribute
  ? Set<FormattedItem<SCHEMA['elements']>>
  : SCHEMA extends ListAttribute
  ? FormattedItem<SCHEMA['elements']>[]
  : SCHEMA extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden attributes
          [KEY in O.SelectKeys<SCHEMA['attributes'], { hidden: false }>]: FormattedItem<
            SCHEMA['attributes'][KEY]
          >
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<SCHEMA['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have defined default (hard or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<SCHEMA['attributes'], { default: undefined }>
    >
  : SCHEMA extends AnyOfAttribute
  ? FormattedItem<SCHEMA['elements'][number]>
  : SCHEMA extends RecordAttribute
  ? Record<ResolvePrimitiveAttribute<SCHEMA['keys']>, FormattedItem<SCHEMA['elements']>>
  : SCHEMA extends EntityV2
  ? FormattedItem<SCHEMA['item']>
  : never
