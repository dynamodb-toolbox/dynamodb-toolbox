import type { AnyAttribute, AnyAttribute_ } from '../any/index.js'
import type { AnyOfAttribute, AnyOfAttribute_ } from '../anyOf/index.js'
import type { ResolvedBinaryAttribute } from '../binary/index.js'
import type { ResolvedBooleanAttribute } from '../boolean/index.js'
import type { ListAttribute, ListAttribute_ } from '../list/index.js'
import type { MapAttribute, MapAttribute_ } from '../map/index.js'
import type { ResolvedNullAttribute } from '../null/index.js'
import type { ResolvedNumberAttribute } from '../number/index.js'
import type { PrimitiveAttribute, PrimitiveAttribute_ } from '../primitive/index.js'
import type { RecordAttribute, RecordAttribute_ } from '../record/index.js'
import type { SetAttribute, SetAttribute_ } from '../set/index.js'
import type { ResolvedStringAttribute } from '../string/index.js'

/**
 * Any attribute
 */
export type Attribute =
  | AnyAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute
  | RecordAttribute
  | AnyOfAttribute

/**
 * Any attribute (extended)
 */
export type Attribute_ =
  | AnyAttribute_
  | PrimitiveAttribute_
  | SetAttribute_
  | ListAttribute_
  | MapAttribute_
  | RecordAttribute_
  | AnyOfAttribute_

/**
 * Any schema attributes
 */
export interface SchemaAttributes {
  [key: string]: Attribute
}

export type Extension = {
  type: Attribute['type'] | '*'
  value: unknown
}

export type ExtendedValue<
  EXTENSIONS extends Extension,
  TYPE extends Attribute['type'] | '*'
> = '*' extends TYPE
  ? EXTENSIONS['value']
  : EXTENSIONS extends infer EXTENSION
    ? EXTENSION extends Extension
      ? EXTENSION['type'] extends infer EXTENSION_TYPE
        ? EXTENSION_TYPE extends TYPE | '*'
          ? EXTENSION['value']
          : never
        : never
      : never
    : never

export type NullAttributeBasicValue = ResolvedNullAttribute
export type NullAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'null'>
  | NullAttributeBasicValue

export type BooleanAttributeBasicValue = ResolvedBooleanAttribute
export type BooleanAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'boolean'>
  | BooleanAttributeBasicValue

export type NumberAttributeBasicValue = ResolvedNumberAttribute
export type NumberAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'number'>
  | NumberAttributeBasicValue

export type StringAttributeBasicValue = ResolvedStringAttribute
export type StringAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'string'>
  | StringAttributeBasicValue

export type BinaryAttributeBasicValue = ResolvedBinaryAttribute
export type BinaryAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'binary'>
  | BinaryAttributeBasicValue

export type SetAttributeBasicValue<EXTENSION extends Extension = never> = Set<
  AttributeValue<EXTENSION>
>
export type SetAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetAttributeBasicValue<EXTENSION>

export type ListAttributeBasicValue<EXTENSION extends Extension = never> =
  AttributeValue<EXTENSION>[]
export type ListAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListAttributeBasicValue<EXTENSION>

export type MapAttributeBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}
export type MapAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapAttributeBasicValue<EXTENSION>

export type RecordAttributeBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION> | undefined
}
export type RecordAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordAttributeBasicValue<EXTENSION>

/**
 * Any possible resolved attribute type
 */
export type AttributeValue<EXTENSION extends Extension = never> =
  | NullAttributeValue<EXTENSION>
  | BooleanAttributeValue<EXTENSION>
  | NumberAttributeValue<EXTENSION>
  | StringAttributeValue<EXTENSION>
  | BinaryAttributeValue<EXTENSION>
  | SetAttributeValue<EXTENSION>
  | ListAttributeValue<EXTENSION>
  | MapAttributeValue<EXTENSION>
  | RecordAttributeValue<EXTENSION>

export type Item<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

export type AttributeBasicValue<EXTENSION extends Extension = never> =
  | NullAttributeBasicValue
  | BooleanAttributeBasicValue
  | NumberAttributeBasicValue
  | StringAttributeBasicValue
  | BinaryAttributeBasicValue
  | SetAttributeBasicValue<EXTENSION>
  | ListAttributeBasicValue<EXTENSION>
  | MapAttributeBasicValue<EXTENSION>
  | RecordAttributeBasicValue<EXTENSION>

export type UndefinedAttrExtension = { type: '*'; value: undefined }
