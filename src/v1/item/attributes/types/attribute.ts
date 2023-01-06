import type { _AnyAttribute, AnyAttribute } from '../any'
import type {
  _PrimitiveAttribute,
  ResolvedPrimitiveAttribute,
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

export type ResolvedListAttribute = ResolvedAttribute[]

export type ResolvedSetAttribute = Set<ResolvedAttribute>

export type ResolvedMapAttribute = { [key: string]: ResolvedAttribute }

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute =
  | ResolvedPrimitiveAttribute
  | ResolvedListAttribute
  | ResolvedSetAttribute
  | ResolvedMapAttribute

export type ResolvedItem = { [key: string]: ResolvedAttribute }

export type PossiblyUndefinedResolvedListAttribute = PossiblyUndefinedResolvedAttribute[]

export type PossiblyUndefinedResolvedSetAttribute = Set<PossiblyUndefinedResolvedAttribute>

export type PossiblyUndefinedResolvedMapAttribute = {
  [key: string]: PossiblyUndefinedResolvedAttribute
}

export type PossiblyUndefinedResolvedAttribute =
  | undefined
  | ResolvedPrimitiveAttribute
  | PossiblyUndefinedResolvedAttribute[]
  | Set<PossiblyUndefinedResolvedAttribute>
  | { [key: string]: PossiblyUndefinedResolvedAttribute }

export type PossiblyUndefinedResolvedItem = {
  [key: string]: PossiblyUndefinedResolvedAttribute
}
