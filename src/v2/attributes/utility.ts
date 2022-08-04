import { O } from 'ts-toolbelt'

import { MappedProperties, Property } from './property'
import { Item } from './item'
import { Leaf } from './leaf'
import { Mapped } from './map'
import { List } from './list'

export type Narrow<M extends MappedProperties | Property> = {
  [K in keyof M]: M[K] extends MappedProperties | Property ? Narrow<M[K]> : M[K]
}

export type Input<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: Input<P['_properties'][key]>
      }>,
      Exclude<
        O.SelectKeys<P['_properties'], { _required: true }>,
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    >
  : P extends List
  ? Input<P['_elements']>[]
  : never

export type Output<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in O.SelectKeys<P['_properties'], { _hidden: false }>]: Output<P['_properties'][key]>
      }>,
      | O.SelectKeys<P['_properties'], { _required: true }>
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    >
  : P extends List
  ? Output<P['_elements']>[]
  : never
