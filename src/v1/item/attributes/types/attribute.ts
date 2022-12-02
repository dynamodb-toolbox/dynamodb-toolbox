import type { _AnyAttribute, AnyAttribute } from '../any'
import type { _LeafAttribute, ResolvedLeafAttributeType, LeafAttribute } from '../leaf'
import type { _SetAttribute, SetAttribute } from '../set'
import type { _ListAttribute, ListAttribute } from '../list'
import type { _MapAttribute, MapAttribute } from '../map'

/**
 * Possible attributes types
 */
export type _Attribute =
  | _AnyAttribute
  | _LeafAttribute
  | _SetAttribute
  | _ListAttribute
  | _MapAttribute

export type Attribute = AnyAttribute | LeafAttribute | SetAttribute | ListAttribute | MapAttribute

/**
 * Dictionary of attributes
 */
export interface _MapAttributeAttributes {
  [key: string]: _Attribute
}

export interface MapAttributeAttributes {
  [key: string]: Attribute
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute =
  | ResolvedLeafAttributeType
  | ResolvedAttribute[]
  | Set<ResolvedAttribute>
  | { [key: string]: ResolvedAttribute }
