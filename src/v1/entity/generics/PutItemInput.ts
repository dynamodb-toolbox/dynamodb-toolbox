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
 * User input of a PUT command for a given Entity, Item or Property
 *
 * @param I Entity | Item | Property
 * @return Object
 */
export type PutItemInput<
  E extends EntityV2 | Item | Property,
  D extends boolean = false
> = E extends Any
  ? ResolvedProperty
  : E extends Leaf
  ? NonNullable<E['_resolved']>
  : E extends List
  ? PutItemInput<E['_elements'], D>[]
  : E extends Mapped | Item
  ? O.Required<
      O.Partial<
        {
          // Keep all properties
          [key in keyof E['_properties']]: PutItemInput<E['_properties'][key], D>
        }
      >,
      // Enforce Required properties except those that have default (will be provided by the lib)
      | O.SelectKeys<
          E['_properties'],
          { _required: AtLeastOnce | OnlyOnce | Always; _default: undefined }
        >
      // Add properties with initial (non-computed) defaults if D is true
      | (D extends true
          ? O.FilterKeys<E['_properties'], { _default: undefined | ComputedDefault }>
          : never)
    > & // Add Record<string, ResolvedProperty> if map is open
      (E extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : E extends EntityV2
  ? PutItemInput<E['item'], D>
  : never
