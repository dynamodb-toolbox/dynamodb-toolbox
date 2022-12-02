import type { O } from 'ts-toolbelt'

import type {
  _Item,
  Item,
  _Attribute,
  Attribute,
  ResolvedAttribute,
  _AnyAttribute,
  AnyAttribute,
  _LeafAttribute,
  LeafAttribute,
  _SetAttribute,
  SetAttribute,
  _ListAttribute,
  ListAttribute,
  _MapAttribute,
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
  : INPUT extends LeafAttribute
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

// TODO: Required in Entity constructor... See if possible to use only PutItem
export type _PutItem<INPUT extends EntityV2 | _Item | _Attribute> = INPUT extends _AnyAttribute
  ? ResolvedAttribute
  : INPUT extends _LeafAttribute
  ? NonNullable<INPUT['_resolved']>
  : INPUT extends _SetAttribute
  ? Set<_PutItem<INPUT['_elements']>>
  : INPUT extends _ListAttribute
  ? _PutItem<INPUT['_elements']>[]
  : INPUT extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof INPUT['_attributes']]: _PutItem<INPUT['_attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<INPUT['_attributes'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<INPUT['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? _PutItem<INPUT['_item']>
  : never
