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

export type Extension = {
  type: Attribute['type'] | '*'
  value: unknown
}

export type ExtendedValue<
  EXTENSION extends Extension,
  TYPE extends Attribute['type'] | '*'
> = Extract<EXTENSION, { type: TYPE | '*' }>['value']

export type PrimitiveAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | PrimitiveAttributeBaseValue

export type PrimitiveAttributeBaseValue = ResolvedPrimitiveAttribute

export type SetAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetAttributeBaseValue<EXTENSION>

export type SetAttributeBaseValue<EXTENSION extends Extension = never> = Set<
  AttributeValue<EXTENSION>
>

export type ListAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | BaseListAttribute<EXTENSION>

export type BaseListAttribute<EXTENSION extends Extension = never> = AttributeValue<EXTENSION>[]

export type MapAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapAttributeBaseValue<EXTENSION>

export type MapAttributeBaseValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

export type RecordAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordAttributeBaseValue<EXTENSION>

export type RecordAttributeBaseValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

/**
 * Any possible resolved attribute type
 */
export type AttributeValue<EXTENSION extends Extension = never> =
  | PrimitiveAttributeValue<EXTENSION>
  | SetAttributeValue<EXTENSION>
  | ListAttributeValue<EXTENSION>
  | MapAttributeValue<EXTENSION>
  | RecordAttributeValue<EXTENSION>

export type Item<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

export type UndefinedAttrExtension = { type: '*'; value: undefined }

export type PossiblyUndefinedAttributeValue = AttributeValue<UndefinedAttrExtension>

export type PossiblyUndefinedItem = Item<UndefinedAttrExtension>
