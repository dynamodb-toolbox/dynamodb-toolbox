import { MappedProperties, Property } from './property'

/**
 * Utility type to narrow the inferred properties of a map or item
 *
 * @param M MappedProperties | Property
 * @return MappedProperties | Property
 */
export type Narrow<M extends MappedProperties | Property> = {
  [K in keyof M]: M[K] extends MappedProperties | Property ? Narrow<M[K]> : M[K]
}
