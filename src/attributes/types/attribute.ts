import type { AnyAttribute } from '../any/index.js'
import type { AnyOfAttribute } from '../anyOf/index.js'
import type { BinaryAttribute, ResolvedBinaryAttribute } from '../binary/index.js'
import type { ListAttribute } from '../list/index.js'
import type { MapAttribute } from '../map/index.js'
import type { NumberAttribute, ResolvedNumberAttribute } from '../number/index.js'
import type {
  PrimitiveAttribute,
  PrimitiveAttributeType,
  ResolvedPrimitiveAttribute
} from '../primitive/index.js'
import type { RecordAttribute } from '../record/index.js'
import type { SetAttribute } from '../set/index.js'
import type { ResolvedStringAttribute, StringAttribute } from '../string/index.js'

/**
 * Any attribute
 */
export type Attribute =
  | AnyAttribute
  | NumberAttribute
  | StringAttribute
  | BinaryAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute
  | RecordAttribute
  | AnyOfAttribute

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

export type PrimitiveAttributeBasicValue = ResolvedPrimitiveAttribute
export type PrimitiveAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, PrimitiveAttributeType>
  | PrimitiveAttributeBasicValue

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
  | NumberAttributeValue<EXTENSION>
  | StringAttributeValue<EXTENSION>
  | BinaryAttributeValue<EXTENSION>
  | PrimitiveAttributeValue<EXTENSION>
  | SetAttributeValue<EXTENSION>
  | ListAttributeValue<EXTENSION>
  | MapAttributeValue<EXTENSION>
  | RecordAttributeValue<EXTENSION>

export type Item<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

export type AttributeBasicValue<EXTENSION extends Extension = never> =
  | NumberAttributeBasicValue
  | StringAttributeBasicValue
  | BinaryAttributeBasicValue
  | PrimitiveAttributeBasicValue
  | SetAttributeBasicValue<EXTENSION>
  | ListAttributeBasicValue<EXTENSION>
  | MapAttributeBasicValue<EXTENSION>
  | RecordAttributeBasicValue<EXTENSION>

export type UndefinedAttrExtension = { type: '*'; value: undefined }
