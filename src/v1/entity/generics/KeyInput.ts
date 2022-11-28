import type { O } from 'ts-toolbelt'

import type {
  FrozenItem,
  _Item,
  FrozenAttribute,
  _Attribute,
  ResolvedAttribute,
  FrozenAnyAttribute,
  _AnyAttribute,
  FrozenLeafAttribute,
  _LeafAttribute,
  FrozenSetAttribute,
  _SetAttribute,
  FrozenListAttribute,
  _ListAttribute,
  FrozenMapAttribute,
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
export type KeyInput<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<KeyInput<Input['elements']>>
  : Input extends FrozenListAttribute
  ? KeyInput<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<Input['attributes'], { key: true }>]: KeyInput<
            Input['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<Input['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? KeyInput<Input['frozenItem']>
  : never

// TODO: Required in Entity constructor... See if possible to use only KeyInput w. FrozenItem
export type _KeyInput<Input extends EntityV2 | _Item | _Attribute> = Input extends _AnyAttribute
  ? ResolvedAttribute
  : Input extends _LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends _SetAttribute
  ? Set<_KeyInput<Input['_elements']>>
  : Input extends _ListAttribute
  ? _KeyInput<Input['_elements']>[]
  : Input extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<Input['_attributes'], { _key: true }>]: _KeyInput<
            Input['_attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required attributes
        O.SelectKeys<Input['_attributes'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['_attributes'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? _KeyInput<Input['_item']>
  : never
