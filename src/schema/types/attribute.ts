import type { ResolvedBinarySchema } from '../binary/index.js'
import type { ResolvedBooleanSchema } from '../boolean/index.js'
import type { ResolvedNullSchema } from '../null/index.js'
import type { ResolvedNumberSchema } from '../number/index.js'
import type { ResolvedStringSchema } from '../string/index.js'
import type { Schema } from './schema.js'

export type Extension = {
  type: Schema['type'] | '*'
  value: unknown
}

export type ExtendedValue<
  EXTENSIONS extends Extension,
  TYPE extends Schema['type'] | '*'
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

export type NullBasicValue = ResolvedNullSchema
export type NullExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'null'>
  | NullBasicValue

export type BooleanBasicValue = ResolvedBooleanSchema
export type BooleanExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'boolean'>
  | BooleanBasicValue

export type NumberBasicValue = ResolvedNumberSchema
export type NumberExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'number'>
  | NumberBasicValue

export type StringBasicValue = ResolvedStringSchema
export type StringExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'string'>
  | StringBasicValue

export type BinaryBasicValue = ResolvedBinarySchema
export type BinaryExtendedAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'binary'>
  | BinaryBasicValue

export type SetBasicValue<EXTENSION extends Extension = never> = Set<SchemaExtendedValue<EXTENSION>>
export type SetExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetBasicValue<EXTENSION>

export type ListBasicValue<EXTENSION extends Extension = never> = SchemaExtendedValue<EXTENSION>[]
export type ListExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListBasicValue<EXTENSION>

export type MapBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION>
}
export type MapExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapBasicValue<EXTENSION>

export type RecordBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
export type RecordExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordBasicValue<EXTENSION>

export type ItemBasicValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
export type ItemExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'item'>
  | ItemBasicValue<EXTENSION>

export type SchemaBasicValue<EXTENSION extends Extension = never> =
  | NullBasicValue
  | BooleanBasicValue
  | NumberBasicValue
  | StringBasicValue
  | BinaryBasicValue
  | SetBasicValue<EXTENSION>
  | ListBasicValue<EXTENSION>
  | MapBasicValue<EXTENSION>
  | RecordBasicValue<EXTENSION>
  | ItemBasicValue<EXTENSION>

export type SchemaExtendedValue<EXTENSION extends Extension = never> =
  | NullExtendedValue<EXTENSION>
  | BooleanExtendedValue<EXTENSION>
  | NumberExtendedValue<EXTENSION>
  | StringExtendedValue<EXTENSION>
  | BinaryExtendedAttributeValue<EXTENSION>
  | SetExtendedValue<EXTENSION>
  | ListExtendedValue<EXTENSION>
  | MapExtendedValue<EXTENSION>
  | RecordExtendedValue<EXTENSION>
  | ItemExtendedValue<EXTENSION>

export type UndefinedAttrExtension = { type: '*'; value: undefined }
