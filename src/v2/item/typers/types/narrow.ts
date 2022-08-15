import { MappedProperties, Property } from './property'

export type Narrow<M extends MappedProperties | Property> = {
  [K in keyof M]: M[K] extends MappedProperties | Property ? Narrow<M[K]> : M[K]
}
