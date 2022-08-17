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
 * Item or Property primary key input of a single item command (GET, DELETE ...) (recursive)
 *
 * @param E Entity
 * @return Object
 */
export type ItemKeyInput<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemKeyInput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep only key properties
        [key in O.SelectKeys<P['_properties'], { _key: true }>]: ItemKeyInput<P['_properties'][key]>
      }>,
      Exclude<
        // Enforce Required properties
        O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>,
        // ...Except those that have default (not required from user, will be provided by the lib)
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
