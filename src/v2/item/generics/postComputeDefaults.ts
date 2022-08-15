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

export type PostComputeDefaults<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PostComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PostComputeDefaults<P['_properties'][key]>
      }>,
      // This is the final item, all required props should be here
      | O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // Besides, all props that have defined default (initial or computed) should be here as well
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
