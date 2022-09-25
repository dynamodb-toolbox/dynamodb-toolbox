import type { O } from 'ts-toolbelt'

import type { Item } from 'v1/item/interface'
import type {
  Attribute,
  ResolvedAttribute,
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
 * Formatted input of an UPDATE command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type UpdateItem<Input extends EntityV2 | Item | Attribute> = Input extends Any
  ? ResolvedAttribute
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? UpdateItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Filter Required OnlyOnce attributes
          [key in O.FilterKeys<Input['_attributes'], { _required: OnlyOnce }>]: UpdateItem<
            Input['_attributes'][key]
          >
        }
      >,
      // Enforce Always Required attributes
      | O.SelectKeys<Input['_attributes'], { _required: Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? UpdateItem<Input['item']>
  : never
