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

import { EntityV2 } from '../class'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity, Item or Property
 *
 * @param Input Entity | Item | Property
 * @return Object
 */
export type FormattedItem<Input extends EntityV2 | Item | Property> = Input extends Any
  ? ResolvedProperty
  : Input extends Leaf
  ? NonNullable<Input['_resolved']>
  : Input extends List
  ? FormattedItem<Input['_elements']>[]
  : Input extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden properties
          [key in O.SelectKeys<Input['_properties'], { _hidden: false }>]: FormattedItem<
            Input['_properties'][key]
          >
        }
      >,
      // Enforce Required properties
      | O.SelectKeys<Input['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce properties that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<Input['_properties'], { _default: undefined }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (Input extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : Input extends EntityV2
  ? FormattedItem<Input['item']>
  : never
