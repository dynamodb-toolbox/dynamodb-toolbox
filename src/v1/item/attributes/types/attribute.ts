import type { $AnyAttribute, AnyAttribute } from '../any'
import type { $ConstantAttribute, ConstantAttribute } from '../constant'
import type {
  $PrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute
} from '../primitive'
import type { $SetAttribute, SetAttribute } from '../set'
import type { $ListAttribute, ListAttribute } from '../list'
import type { $MapAttribute, MapAttribute } from '../map'

/**
 * Possible attributes types
 */
export type $Attribute =
  | $AnyAttribute
  | $ConstantAttribute
  | $PrimitiveAttribute
  | $SetAttribute
  | $ListAttribute
  | $MapAttribute

export type Attribute =
  | AnyAttribute
  | ConstantAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute

/**
 * Dictionary of attributes
 */
export interface $MapAttributeAttributes {
  [key: string]: $Attribute
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
