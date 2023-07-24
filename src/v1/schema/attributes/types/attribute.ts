import type { $AnyAttribute, AnyAttribute } from '../any'
import type {
  $PrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute,
  PrimitiveAttributeType
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

export type Extension = {
  type: Attribute['type'] | '*'
  value: unknown
}

export type ExtractExtension<
  EXTENSION extends Extension,
  TYPE extends Attribute['type'] | '*'
> = Extract<EXTENSION, { type: TYPE | '*' }>['value']

export type ResolvedListAttribute<EXTENSION extends Extension = never> =
  | ExtractExtension<EXTENSION, 'list'>
  | ResolvedAttribute<EXTENSION>[]

export type ResolvedSetAttribute<EXTENSION extends Extension = never> =
  | ExtractExtension<EXTENSION, 'set'>
  | Set<ResolvedAttribute<EXTENSION>>

// Note: Extracting not needed right now & complex to implement
export type ResolvedMapAttribute<EXTENSION extends Extension = never> = {
  [key: string]: ResolvedAttribute<EXTENSION>
}

// Note: Extracting not needed right now & complex to implement
export type ResolvedRecordAttribute<EXTENSION extends Extension = never> = {
  [key: string]: ResolvedAttribute<EXTENSION>
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute<EXTENSION extends Extension = never> =
  | ExtractExtension<EXTENSION, PrimitiveAttributeType>
  | ResolvedPrimitiveAttribute
  | ResolvedListAttribute<EXTENSION>
  | ResolvedSetAttribute<EXTENSION>
  | ResolvedMapAttribute<EXTENSION>
  | ResolvedRecordAttribute<EXTENSION>

export type ResolvedItem<EXTENSION extends Extension = never> = {
  [key: string]: ResolvedAttribute<EXTENSION>
}

export type UndefinedAttrExtension = { type: '*'; value: undefined }

export type PossiblyUndefinedResolvedAttribute = ResolvedAttribute<UndefinedAttrExtension>

export type PossiblyUndefinedResolvedItem = ResolvedItem<UndefinedAttrExtension>
