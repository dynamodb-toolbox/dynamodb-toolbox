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
 * Expected computeDefaults output for a given Item or Property (recursive)
 * Very similar to Output but displays hidden properties
 *
 * @param I Item / Property
 * @return Object
 */
export type PostComputeDefaults<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PostComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep all properties
        [key in keyof P['_properties']]: PostComputeDefaults<P['_properties'][key]>
      }>,
      // Enforce Required properties
      | O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Enforce properties that have defined default (initial or computed)
      // (...but not so sure about that anymore, props can have computed default but still be optional)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
