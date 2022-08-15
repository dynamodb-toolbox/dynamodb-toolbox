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

export type PreComputeDefaults<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PreComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PreComputeDefaults<P['_properties'][key]>
      }>,
      // Required props without default will be provided
      | O.SelectKeys<
          P['_properties'],
          {
            _required: AtLeastOnce | OnlyOnce | Always
            _default: undefined
          }
        >
      // Props with initial default will be provided
      | O.FilterKeys<P['_properties'], { _default: undefined | ComputedDefault }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
