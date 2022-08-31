import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type { Property, ResolvedProperty, Leaf, Mapped, List, Any, Always } from 'v1/item/typers'

import { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity, Item or Property
 *
 * @param E Entity
 * @return Object
 */
export type KeyInput<E extends EntityV2 | Item | Property> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? KeyInput<E['_elements']>[]
  : E extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key properties
          [key in O.SelectKeys<E['_properties'], { _key: true }>]: KeyInput<E['_properties'][key]>
        }
      >,
      Exclude<
        // Enforce Always Required properties
        O.SelectKeys<E['_properties'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<E['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (E extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : E extends EntityV2
  ? KeyInput<E['item']>
  : never
