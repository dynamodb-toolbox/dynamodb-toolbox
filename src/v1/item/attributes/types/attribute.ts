import type { $AnyAttribute, AnyAttribute } from '../any'
import type {
  $PrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute
} from '../primitive'
import type { $SetAttribute, SetAttribute } from '../set'
import type { $ListAttribute, ListAttribute } from '../list'
import type { $MapAttribute, MapAttribute } from '../map'
import type { $RecordAttribute, RecordAttribute } from '../record'
import type { $AnyOfAttribute, AnyOfAttribute } from '../anyOf'

/**
 * Possible attributes types
 */
export type $Attribute =
  | $AnyAttribute
  | $PrimitiveAttribute
  | $SetAttribute
  | $ListAttribute
  | $MapAttribute
  | $RecordAttribute
  | $AnyOfAttribute

export type Attribute =
  | AnyAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute
  | RecordAttribute
  | AnyOfAttribute

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
