import { O } from 'ts-toolbelt'

import { MappedProperties, Property } from './property'
import { Item } from './item'
import { Leaf } from './leaf'
import { Mapped } from './map'
import { List } from './list'

export const ComputedDefault = Symbol('Tag for properties with computed default values')

export type ComputedDefault = typeof ComputedDefault

export type Narrow<M extends MappedProperties | Property> = {
  [K in keyof M]: M[K] extends MappedProperties | Property ? Narrow<M[K]> : M[K]
}

export type PreComputedDefaults<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PreComputedDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PreComputedDefaults<P['_properties'][key]>
      }>,
      // Required props without default will be provided
      | O.SelectKeys<P['_properties'], { _required: true; _default: undefined }>
      // Props with initial default will be provided
      | O.FilterKeys<P['_properties'], { _default: undefined | ComputedDefault }>
    >
  : never

export type PostComputedDefaults<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PostComputedDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PostComputedDefaults<P['_properties'][key]>
      }>,
      // This is the final item, all required props should be here
      | O.SelectKeys<P['_properties'], { _required: true }>
      // Besides, all props that have defined default (initial or computed) should be here as well
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    >
  : never

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
  : P extends List
  ? Output<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        // hidden props are omitted
        [key in O.SelectKeys<P['_properties'], { _hidden: false }>]: Output<P['_properties'][key]>
      }>,
      // required props will necessarily be present
      | O.SelectKeys<P['_properties'], { _required: true }>
      // props that have defined default (initial or computed) will necessarily be present
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    >
  : never
