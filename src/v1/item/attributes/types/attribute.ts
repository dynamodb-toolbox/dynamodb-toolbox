import type { AnyAttribute, FrozenAnyAttribute } from '../any'
import type { LeafAttribute, ResolvedLeafAttributeType, FrozenLeafAttribute } from '../leaf'
import type { SetAttribute, FrozenSetAttribute } from '../set'
import type { ListAttribute, FrozenListAttribute } from '../list'
import type { MapAttribute, FrozenMapAttribute } from '../map'

/**
 * Possible attributes types
 */
export type Attribute = AnyAttribute | LeafAttribute | SetAttribute | ListAttribute | MapAttribute

export type FrozenAttribute =
  | FrozenAnyAttribute
  | FrozenLeafAttribute
  | FrozenSetAttribute
  | FrozenListAttribute
  | FrozenMapAttribute

/**
 * Dictionary of attributes
 */
export interface MapAttributeAttributes {
  [key: string]: Attribute
}

export interface FrozenMapAttributeAttributes {
  [key: string]: FrozenAttribute
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute =
  | ResolvedLeafAttributeType
  | ResolvedAttribute[]
  | Set<ResolvedAttribute>
  | { [key: string]: ResolvedAttribute }
