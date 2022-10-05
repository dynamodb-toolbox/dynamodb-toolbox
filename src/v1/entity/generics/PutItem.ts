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
  AtLeastOnce,
  OnlyOnce,
  Always,
  ComputedDefault
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * Formatted input of a PUT command for a given Entity, Item or Attribute
 *
 * @param Input Entity | Item | Attribute
 * @return Object
 */
export type PutItem<Input extends EntityV2 | Item | Attribute> = Input extends Any
  ? ResolvedAttribute
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends SetAttribute
  ? Set<PutItem<Input['_elements']>>
  : Input extends List
  ? PutItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all attributes
          [key in keyof Input['_attributes']]: PutItem<Input['_attributes'][key]>
        }
      >,
      // Enforce Required attributes
      | O.SelectKeys<Input['_attributes'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce attributes that have initial default
      | O.FilterKeys<Input['_attributes'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedAttribute> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedAttribute> : {})
  : Input extends EntityV2
  ? PutItem<Input['item']>
  : never
