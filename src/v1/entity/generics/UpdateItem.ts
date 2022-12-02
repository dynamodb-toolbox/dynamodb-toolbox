import type { O } from 'ts-toolbelt'

import type {
  Item,
  Attribute,
  ResolvedAttribute,
  AnyAttribute,
  LeafAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * Formatted input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItem<Input extends EntityV2 | Item | Attribute> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends SetAttribute
  ? Set<UpdateItem<Input['elements']>>
  : Input extends ListAttribute
  ? UpdateItem<Input['elements']>[]
  : Input extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<Input['attributes'], { required: OnlyOnce }>]: UpdateItem<
            Input['attributes'][key]
          >
        }
      >,
      // Enforce Always Required attributes
      | O.SelectKeys<Input['attributes'], { required: Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['attributes'], { default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItem<Input['item']>
  : never
