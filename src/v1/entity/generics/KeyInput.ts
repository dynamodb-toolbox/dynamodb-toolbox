import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type { Property, ResolvedProperty, Leaf, Mapped, List, Any, Always } from 'v1/item/typers'

import { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @return Object
 */
export type KeyInput<Input extends EntityV2 | Item | Property> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? KeyInput<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key properties
          [key in O.SelectKeys<Input['_properties'], { _key: true }>]: KeyInput<
            Input['_properties'][key]
          >
        }
      >,
      Exclude<
        // Enforce Always Required properties
        O.SelectKeys<Input['_properties'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : Input extends EntityV2
  ? KeyInput<Input['item']>
  : never
