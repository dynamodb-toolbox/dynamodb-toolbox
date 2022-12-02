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
  Always
} from 'v1/item'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItemInput<Input extends EntityV2 | Item | Attribute> = Input extends AnyAttribute
  ? ResolvedAttribute
  : Input extends LeafAttribute
  ? NonNullable<Input['resolved']>
  : Input extends SetAttribute
  ? Set<UpdateItemInput<Input['elements']>>
  : Input extends ListAttribute
  ? UpdateItemInput<Input['elements']>[]
  : Input extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<Input['attributes'], { required: OnlyOnce }>]: UpdateItemInput<
            Input['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<Input['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItemInput<Input['item']>
  : never
