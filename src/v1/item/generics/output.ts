import type { O } from 'ts-toolbelt'

import type { Item } from '../interface'
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
} from '../typers'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Entity
 *
 * @param E Entity
 * @return Object
 */
export type ItemOutput<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemOutput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep only non-hidden properties
        [key in O.SelectKeys<P['_properties'], { _hidden: false }>]: ItemOutput<
          P['_properties'][key]
        >
      }>,
      // Enforce Required properties
      | O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce properties that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
