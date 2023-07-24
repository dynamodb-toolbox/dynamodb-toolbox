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

export type AdditionalResolution = {
  type: Attribute['type'] | '*'
  value: unknown
}

export type ExtractAdditionalResolution<
  ADDITIONAL_RESOLUTION extends AdditionalResolution,
  TYPE extends Attribute['type'] | '*'
> = Extract<ADDITIONAL_RESOLUTION, { type: TYPE | '*' }>['value']

export type ResolvedListAttribute<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, 'list'>
  | ResolvedAttribute<ADDITIONAL_RESOLUTION>[]

export type ResolvedSetAttribute<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, 'set'>
  | Set<ResolvedAttribute<ADDITIONAL_RESOLUTION>>

// Note: Extracting not needed right now & complex to implement
export type ResolvedMapAttribute<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> = {
  [key: string]: ResolvedAttribute<ADDITIONAL_RESOLUTION>
}

// Note: Extracting not needed right now & complex to implement
export type ResolvedRecordAttribute<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> = {
  [key: string]: ResolvedAttribute<ADDITIONAL_RESOLUTION>
}

/**
 * Any possible resolved attribute type
 */
export type ResolvedAttribute<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, PrimitiveAttributeType>
  | ResolvedPrimitiveAttribute
  | ResolvedListAttribute<ADDITIONAL_RESOLUTION>
  | ResolvedSetAttribute<ADDITIONAL_RESOLUTION>
  | ResolvedMapAttribute<ADDITIONAL_RESOLUTION>
  | ResolvedRecordAttribute<ADDITIONAL_RESOLUTION>

export type ResolvedItem<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> = {
  [key: string]: ResolvedAttribute<ADDITIONAL_RESOLUTION>
}

export type PossiblyUndefinedAdditionalResolution = { type: '*'; value: undefined }

export type PossiblyUndefinedResolvedAttribute = ResolvedAttribute<PossiblyUndefinedAdditionalResolution>

export type PossiblyUndefinedResolvedItem = ResolvedItem<PossiblyUndefinedAdditionalResolution>
