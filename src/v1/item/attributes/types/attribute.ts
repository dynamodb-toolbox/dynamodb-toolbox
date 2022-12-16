import type { _AnyAttribute, AnyAttribute } from '../any'
import type {
  _PrimitiveAttribute,
  ResolvedPrimitiveAttributeType,
  PrimitiveAttribute
} from '../primitive'
import type { _SetAttribute, SetAttribute } from '../set'
import type { _ListAttribute, ListAttribute } from '../list'
import type { _MapAttribute, MapAttribute } from '../map'

/**
 * Possible attributes types
 */
export type _Attribute =
  | _AnyAttribute
  | _PrimitiveAttribute
  | _SetAttribute
  | _ListAttribute
  | _MapAttribute

export type Attribute =
  | AnyAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute

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
  | ResolvedPrimitiveAttributeType
  | ResolvedAttribute[]
  | Set<ResolvedAttribute>
  | { [key: string]: ResolvedAttribute }

export type PossiblyUndefinedResolvedAttribute =
  | undefined
  | ResolvedPrimitiveAttributeType
  | PossiblyUndefinedResolvedAttribute[]
  | Set<PossiblyUndefinedResolvedAttribute>
  | { [key: string]: PossiblyUndefinedResolvedAttribute }
