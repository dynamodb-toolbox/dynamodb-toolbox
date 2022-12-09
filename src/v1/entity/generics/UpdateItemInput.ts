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
export type UpdateItemInput<INPUT extends EntityV2 | Item | Attribute> = INPUT extends AnyAttribute
  ? ResolvedAttribute
  : INPUT extends PrimitiveAttribute
  ? NonNullable<INPUT['resolved']>
  : INPUT extends SetAttribute
  ? Set<UpdateItemInput<INPUT['elements']>>
  : INPUT extends ListAttribute
  ? UpdateItemInput<INPUT['elements']>[]
  : INPUT extends MapAttribute | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<INPUT['attributes'], { required: OnlyOnce }>]: UpdateItemInput<
            INPUT['attributes'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always attributes...
        O.SelectKeys<INPUT['attributes'], { required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<INPUT['attributes'], { default: undefined }>
      >
    > & // Add Record<string, ResolvedAttribute> if map is open
      (INPUT extends { open: true } ? Record<string, ResolvedAttribute> : {})
  : INPUT extends EntityV2
  ? UpdateItemInput<INPUT['item']>
  : never
