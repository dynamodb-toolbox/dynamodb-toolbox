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
 * Item or Property input of a PUT command for a given Entity (recursive)
 *
 * @param I Item / Property
 * @return Object
 */
export type ItemInput<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemInput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep all properties
        [key in keyof P['_properties']]: ItemInput<P['_properties'][key]>
      }>,
      Exclude<
        // Enforce Required properties...
        O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>,
        // ...Except those that have default (not required from user, will be provided by the lib)
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
