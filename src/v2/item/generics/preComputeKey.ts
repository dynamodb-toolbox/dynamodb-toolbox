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
 * Primary key input of a single item command (GET, DELETE ...) for a given Item or Property (recursive)
 *
 * @param I Item / Property
 * @return Object
 */
export type ItemPreComputeKey<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemPreComputeKey<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep only key properties
        [key in O.SelectKeys<P['_properties'], { _key: true }>]: ItemPreComputeKey<
          P['_properties'][key]
        >
      }>,
      // Required attributes without default will be provided by user
      | O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // props that have defined default (initial or computed) will necessarily be present
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
