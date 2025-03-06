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

export type NullUnextendedValue = ResolvedNullSchema
export type NullExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'null'>
  | NullUnextendedValue

export type BooleanUnextendedValue = ResolvedBooleanSchema
export type BooleanExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'boolean'>
  | BooleanUnextendedValue

export type NumberUnextendedValue = ResolvedNumberSchema
export type NumberExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'number'>
  | NumberUnextendedValue

export type StringUnextendedValue = ResolvedStringSchema
export type StringExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'string'>
  | StringUnextendedValue

export type BinaryUnextendedValue = ResolvedBinarySchema
export type BinaryExtendedAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'binary'>
  | BinaryUnextendedValue

export type SetUnextendedValue<EXTENSION extends Extension = never> = Set<
  SchemaExtendedValue<EXTENSION>
>
export type SetExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetUnextendedValue<EXTENSION>

export type ListUnextendedValue<EXTENSION extends Extension = never> =
  SchemaExtendedValue<EXTENSION>[]
export type ListExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListUnextendedValue<EXTENSION>

export type MapUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION>
}
export type MapExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapUnextendedValue<EXTENSION>

export type RecordUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
export type RecordExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordUnextendedValue<EXTENSION>

export type ItemUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
export type ItemExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'item'>
  | ItemUnextendedValue<EXTENSION>

export type SchemaUnextendedValue<EXTENSION extends Extension = never> =
  | NullUnextendedValue
  | BooleanUnextendedValue
  | NumberUnextendedValue
  | StringUnextendedValue
  | BinaryUnextendedValue
  | SetUnextendedValue<EXTENSION>
  | ListUnextendedValue<EXTENSION>
  | MapUnextendedValue<EXTENSION>
  | RecordUnextendedValue<EXTENSION>
  | ItemUnextendedValue<EXTENSION>

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
