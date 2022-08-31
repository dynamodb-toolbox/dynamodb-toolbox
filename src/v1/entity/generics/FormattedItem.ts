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
 * @param E Entity | Item | Property
 * @return Object
 */
export type FormattedItem<E extends EntityV2 | Item | Property> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? FormattedItem<E['_elements']>[]
  : E extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep only non-hidden properties
          [key in O.SelectKeys<E['_properties'], { _hidden: false }>]: FormattedItem<
            E['_properties'][key]
          >
        }
      >,
      // Enforce Required properties
      | O.SelectKeys<E['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce properties that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<E['_properties'], { _default: undefined }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (E extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : E extends EntityV2
  ? FormattedItem<E['item']>
  : never
