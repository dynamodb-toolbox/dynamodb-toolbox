import type { O } from 'ts-toolbelt'

import type {
  Item,
  _Item,
  Attribute,
  _Attribute,
  ResolvedAttribute,
  AnyAttribute,
  _AnyAttribute,
  PrimitiveAttribute,
  _PrimitiveAttribute,
  SetAttribute,
  _SetAttribute,
  ListAttribute,
  _ListAttribute,
  MapAttribute,
  _MapAttribute,
  Always
} from 'v1/item'

import { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type KeyInput<INPUT extends EntityV2 | Item | Attribute> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends PrimitiveAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<KeyInput<INPUT['elements']>>
  : INPUT extends ListAttribute
  ? KeyInput<INPUT['elements']>[]
  : INPUT extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<INPUT['attributes'], { key: true }>]: KeyInput<
            INPUT['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<INPUT['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<INPUT['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? KeyInput<INPUT['item']>
  : never

// TODO: Required in Entity constructor... See if possible to use only KeyInput w. Item
export type _KeyInput<INPUT extends EntityV2 | _Item | _Attribute> = INPUT extends _AnyAttribute
  ? ResolvedAttribute
  : INPUT extends _PrimitiveAttribute
  ? NonNullable<INPUT['_resolved']>
  : INPUT extends _SetAttribute
  ? Set<_KeyInput<INPUT['_elements']>>
  : INPUT extends _ListAttribute
  ? _KeyInput<INPUT['_elements']>[]
  : INPUT extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<INPUT['_attributes'], { _key: true }>]: _KeyInput<
            INPUT['_attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<INPUT['_attributes'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<INPUT['_attributes'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? _KeyInput<INPUT['_item']>
  : never
