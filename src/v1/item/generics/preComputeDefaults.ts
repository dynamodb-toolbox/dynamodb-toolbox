import type { O } from 'ts-toolbelt'

import type { Item } from '../interface'
import type {
  Property,
  ResolvedProperty,
  Leaf,
  Mapped,
  List,
  Any,
  ComputedDefault,
  AtLeastOnce,
  OnlyOnce,
  Always
} from '../typers'

/**
 * Expected computeDefaults argument for a given Item or Property (recursive)
 *
 * @param I Item / Property
 * @return Object
 */
export type PreComputeDefaults<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PreComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // Keep all properties
        [key in keyof P['_properties']]: PreComputeDefaults<P['_properties'][key]>
      }>,
      // Required properties without default will be provided by user
      | O.SelectKeys<
          P['_properties'],
          {
            _required: AtLeastOnce | OnlyOnce | Always
            _default: undefined
          }
        >
      // Properties with initial (non-computed) default will be provided by the library
      | O.FilterKeys<P['_properties'], { _default: undefined | ComputedDefault }>
    > & // Add Record<string, ResolvedProperty> if map is open
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
