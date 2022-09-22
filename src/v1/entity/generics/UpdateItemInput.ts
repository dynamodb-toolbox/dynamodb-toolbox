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
  Always
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * User input of an UPDATE command for a given Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @return Object
 */
export type UpdateItemInput<Input extends EntityV2 | Item | Property> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? UpdateItemInput<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce properties
          [key in O.FilterKeys<Input['_properties'], { _required: OnlyOnce }>]: UpdateItemInput<
            Input['_properties'][key]
          >
        }
      >,
      Exclude<
        // Enforce Required Always properties...
        O.SelectKeys<Input['_properties'], { _required: Always }>,
        // ...Except those that have default (not required from user, can be provided by the lib)
        O.FilterKeys<Input['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : Input extends EntityV2
  ? UpdateItemInput<Input['item']>
  : never
