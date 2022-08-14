import { A, O, U } from 'ts-toolbelt'

import { MappedProperties, Property, ResolvedProperty } from './property'
import { Item } from './item'
import { Leaf, validateLeaf } from './leaf'
import { Mapped, validateMap } from './map'
import { List, validateList } from './list'

export const ComputedDefault = Symbol('Tag for properties with computed default values')

export type ComputedDefault = typeof ComputedDefault

export type Narrow<M extends MappedProperties | Property> = {
  [K in keyof M]: M[K] extends MappedProperties | Property ? Narrow<M[K]> : M[K]
}

export type PreComputeDefaults<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PreComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PreComputeDefaults<P['_properties'][key]>
      }>,
      // Required props without default will be provided
      | O.SelectKeys<P['_properties'], { _required: true; _default: undefined }>
      // Props with initial default will be provided
      | O.FilterKeys<P['_properties'], { _default: undefined | ComputedDefault }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

export type PostComputeDefaults<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? PostComputeDefaults<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: PostComputeDefaults<P['_properties'][key]>
      }>,
      // This is the final item, all required props should be here
      | O.SelectKeys<P['_properties'], { _required: true }>
      // Besides, all props that have defined default (initial or computed) should be here as well
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

export type ItemInput<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemInput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in keyof P['_properties']]: ItemInput<P['_properties'][key]>
      }>,
      Exclude<
        O.SelectKeys<P['_properties'], { _required: true }>,
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

export type ItemOutput<P extends Item | Property> = P extends Leaf
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
      | O.SelectKeys<P['_properties'], { _required: true }>
      // props that have defined default (initial or computed) will necessarily be present
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

type SwapWithSavedAs<O extends MappedProperties> = A.Compute<
  U.IntersectOf<
    {
      [K in keyof O]: O[K] extends { _savedAs: string }
        ? Record<O[K]['_savedAs'], O[K]>
        : Record<K, O[K]>
    }[keyof O]
  >
>

type ItemRecSavedAs<
  P extends Mapped | Item,
  S extends MappedProperties = SwapWithSavedAs<P['_properties']>
> = O.Required<
  O.Partial<{
    [key in keyof S]: ItemSavedAs<S[key]>
  }>,
  // required props will necessarily be present
  | O.SelectKeys<S, { _required: true }>
  // props that have defined default (initial or computed) will necessarily be present
  | O.FilterKeys<S, { _default: undefined }>
> &
  (P extends { _open: true } ? Record<string, ResolvedProperty> : {})

export type ItemSavedAs<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemSavedAs<P['_elements']>[]
  : P extends Mapped | Item
  ? ItemRecSavedAs<P>
  : never

export type ItemKeyInput<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemKeyInput<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in O.SelectKeys<P['_properties'], { _key: true }>]: ItemKeyInput<P['_properties'][key]>
      }>,
      Exclude<
        O.SelectKeys<P['_properties'], { _required: true }>,
        O.FilterKeys<P['_properties'], { _default: undefined }>
      >
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

export type ItemPreComputeKey<P extends Item | Property> = P extends Leaf
  ? Exclude<P['_resolved'], undefined>
  : P extends List
  ? ItemPreComputeKey<P['_elements']>[]
  : P extends Mapped | Item
  ? O.Required<
      O.Partial<{
        [key in O.SelectKeys<P['_properties'], { _key: true }>]: ItemPreComputeKey<
          P['_properties'][key]
        >
      }>,
      // required props will necessarily be present
      | O.SelectKeys<P['_properties'], { _required: true }>
      // props that have defined default (initial or computed) will necessarily be present
      // (...but not so sure about that anymore, props can have computed default but be not required)
      | O.FilterKeys<P['_properties'], { _default: undefined }>
    > &
      (P extends { _open: true } ? Record<string, ResolvedProperty> : {})
  : never

export type HasComputedDefaults<P extends Item | Property> = P extends { _default: ComputedDefault }
  ? true
  : P extends List
  ? HasComputedDefaults<P['_elements']>
  : P extends Mapped | Item
  ? true extends {
      [K in keyof P['_properties']]: HasComputedDefaults<P['_properties'][K]>
    }[keyof P['_properties']]
    ? true
    : false
  : never

export const errorMessagePathSuffix = (path?: string): string =>
  path !== undefined ? ` at path ${path}` : ''

export const validateProperty = (property: Property, path?: string): boolean => {
  switch (property._type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'binary':
      return validateLeaf(property, path)
    case 'list':
      return validateList(property, path)
    case 'map':
      return validateMap(property, path)
  }
}
