import type { _AnyAttribute, FrozenAnyAttribute } from '../any'
import type { _LeafAttribute, ResolvedLeafAttributeType, FrozenLeafAttribute } from '../leaf'
import type { _SetAttribute, FrozenSetAttribute } from '../set'
import type { _ListAttribute, FrozenListAttribute } from '../list'
import type { _MapAttribute, FrozenMapAttribute } from '../map'

/**
 * Possible attributes types
 */
export type _Attribute =
  | _AnyAttribute
  | _LeafAttribute
  | _SetAttribute
  | _ListAttribute
  | _MapAttribute

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
  [key: string]: _Attribute
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
