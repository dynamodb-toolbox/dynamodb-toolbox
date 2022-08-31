import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Property,
  ResolvedProperty,
  Leaf,
  Mapped,
  List,
  Any,
  AtLeastOnce,
  OnlyOnce,
  Always
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Property
 *
 * @param I Entity | Item | Property
 * @return Object
 */
export type UpdateItemInput<E extends EntityV2 | Item | Property> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? UpdateItemInput<E['_elements']>[]
  : E extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce properties
          [key in O.FilterKeys<E['_properties'], { _required: OnlyOnce }>]: UpdateItemInput<
            E['_properties'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always properties...
        O.SelectKeys<E['_properties'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<E['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (E extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : E extends EntityV2
  ? UpdateItemInput<E['item']>
  : never
