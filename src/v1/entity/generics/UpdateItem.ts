import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Property,
  ResolvedProperty,
  Leaf,
  Mapped,
  List,
  Any,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * Formatted input of an UPDATE command for a given Entity, Item or Property
 *
 * @param I Entity | Item | Property
 * @return Object
 */
export type UpdateItem<E extends EntityV2 | Item | Property> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? UpdateItem<E['_elements']>[]
  : E extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce properties
          [key in O.FilterKeys<E['_properties'], { _required: OnlyOnce }>]: UpdateItem<
            E['_properties'][key]
          >
        }
      >,
      // Enforce Always Required properties
      | O.SelectKeys<E['_properties'], { _required: Always }>
      // Enforce properties that have initial default
      | O.FilterKeys<E['_properties'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (E extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : E extends EntityV2
  ? UpdateItem<E['item']>
  : never
