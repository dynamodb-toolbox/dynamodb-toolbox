import type { O } from 'ts-toolbelt'

import type {
  _Item,
  FrozenItem,
  _Attribute,
  FrozenAttribute,
  ResolvedAttribute,
  _AnyAttribute,
  FrozenAnyAttribute,
  _LeafAttribute,
  FrozenLeafAttribute,
  _SetAttribute,
  FrozenSetAttribute,
  _ListAttribute,
  FrozenListAttribute,
  _MapAttribute,
  FrozenMapAttribute,
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
export type PutItem<
  Input extends EntityV2 | FrozenItem | FrozenAttribute
> = Input extends FrozenAnyAttribute
  ? ResolvedAttribute
  : Input extends FrozenLeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends FrozenSetAttribute
  ? Set<PutItem<Input['elements']>>
  : Input extends FrozenListAttribute
  ? PutItem<Input['elements']>[]
  : Input extends FrozenMapAttribute | FrozenItem
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof Input['attributes']]: PutItem<Input['attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<Input['attributes'], { required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? PutItem<Input['frozenItem']>
  : never

// TODO: Required in Entity constructor... See if possible to use only PutItem
export type _PutItem<Input extends EntityV2 | _Item | _Attribute> = Input extends _AnyAttribute
  ? ResolvedAttribute
  : Input extends _LeafAttribute
  ? NonNullable<Input['_resolved']>
  : Input extends _SetAttribute
  ? Set<_PutItem<Input['_elements']>>
  : Input extends _ListAttribute
  ? _PutItem<Input['_elements']>[]
  : Input extends _MapAttribute | _Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof Input['_attributes']]: _PutItem<Input['_attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<Input['_attributes'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? _PutItem<Input['_item']>
  : never
