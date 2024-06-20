import type { AnyAttribute } from '../any/index.js'
import type {
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute,
  PrimitiveAttributeType
} from '../primitive/index.js'
import type { SetAttribute } from '../set/index.js'
import type { ListAttribute } from '../list/index.js'
import type { MapAttribute } from '../map/index.js'
import type { RecordAttribute } from '../record/index.js'
import type { AnyOfAttribute } from '../anyOf/index.js'

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

export type PrimitiveAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, PrimitiveAttributeType>
  | PrimitiveAttributeBasicValue

export type PrimitiveAttributeBasicValue = ResolvedPrimitiveAttribute

export type SetAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetAttributeBasicValue<EXTENSION>

export type SetAttributeBasicValue<EXTENSION extends Extension = never> = Set<
  AttributeValue<EXTENSION>
>

export type ListAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListAttributeBasicValue<EXTENSION>

export type ListAttributeBasicValue<
  EXTENSION extends Extension = never
> = AttributeValue<EXTENSION>[]

export type MapAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapAttributeBasicValue<EXTENSION>

export type MapAttributeBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION>
}

export type RecordAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordAttributeBasicValue<EXTENSION>

export type RecordAttributeBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: AttributeValue<EXTENSION> | undefined
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

export type AttributeBasicValue<EXTENSION extends Extension = never> =
  | PrimitiveAttributeBasicValue
  | SetAttributeBasicValue<EXTENSION>
  | ListAttributeBasicValue<EXTENSION>
  | MapAttributeBasicValue<EXTENSION>
  | RecordAttributeBasicValue<EXTENSION>

export type UndefinedAttrExtension = { type: '*'; value: undefined }
