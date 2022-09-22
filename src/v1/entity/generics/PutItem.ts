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
  Always,
  ComputedDefault
} from 'v1/item/typers'

import type { EntityV2 } from '../class'

/**
 * Formatted input of a PUT command for a given Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @return Object
 */
export type PutItem<Input extends EntityV2 | Item | Property> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? PutItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all properties
          [key in keyof Input['_properties']]: PutItem<Input['_properties'][key]>
        }
      >,
      // Enforce Required properties
      | O.SelectKeys<Input['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce properties that have initial default
      | O.FilterKeys<Input['_properties'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : Input extends EntityV2
  ? PutItem<Input['item']>
  : never
