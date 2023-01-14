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
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type PutItem<INPUT extends EntityV2 | Item | Attribute> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends PrimitiveAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<PutItem<INPUT['elements']>>
  : INPUT extends ListAttribute
  ? PutItem<INPUT['elements']>[]
  : INPUT extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof INPUT['attributes']]: PutItem<INPUT['attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<INPUT['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<INPUT['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? PutItem<INPUT['item']>
  : never
