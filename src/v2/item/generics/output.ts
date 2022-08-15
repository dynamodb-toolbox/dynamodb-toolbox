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

export type ItemOutput<P extends Item | Property> = P extends Any
  ? ResolvedProperty
  : P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemOutput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // hidden props are omitted
        [key in O.SelectKeys<P['_properties'], { _hidden: false }>]: ItemOutput<
          P['_properties'][key]
        >
      }>,
      // required props will necessarily be present
      | O.SelectKeys<P['_properties'], { _required: AtLeastOnce | OnlyOnce | Always }>
      // props that have defined default (initial or computed) will necessarily be present
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never
