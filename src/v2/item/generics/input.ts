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

export type ItemInput<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemInput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: ItemInput<P['_properties'][key]>
      }>,
      Exclude<
        O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>,
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
