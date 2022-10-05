import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Attribute,
  ResolvedAttribute,
  Any,
  Leaf,
  SetAttribute,
  List,
  Mapped,
  Always
} from 'v1/item/typers'

import { EntityV2 } from '../class'

/**
 * Key input of a single item command (GET, DELETE ...) for an Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type KeyInput<Input extends EntityV2 | Item | Attribute> = Input extends Any
  ? ResolvedAttribute
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<KeyInput<Input['_elements']>>
  : Input extends List
  ? KeyInput<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only key attributes
          [key in O.SelectKeys<Input['_attributes'], { _key: true }>]: KeyInput<
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
  ? KeyInput<Input['item']>
  : never
