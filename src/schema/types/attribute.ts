import type { ResolvedBinarySchema } from '../binary/index.js'
import type { ResolvedBooleanSchema } from '../boolean/index.js'
import type { ResolvedNullSchema } from '../null/index.js'
import type { ResolvedNumberSchema } from '../number/index.js'
import type { ResolvedStringSchema } from '../string/index.js'
import type { Schema } from './schema.js'

/**
 * A custom value type injected into schemas by an extension parser.
 */
export type Extension = {
  type: Schema['type'] | '*'
  value: unknown
}

/**
 * Extension values matching a given schema type.
 */
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

/**
 * Runtime value of a null schema, without extensions.
 */
export type NullUnextendedValue = ResolvedNullSchema
/**
 * Runtime value of a null schema, including extensions.
 */
export type NullExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'null'>
  | NullUnextendedValue

/**
 * Runtime value of a boolean schema, without extensions.
 */
export type BooleanUnextendedValue = ResolvedBooleanSchema
/**
 * Runtime value of a boolean schema, including extensions.
 */
export type BooleanExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'boolean'>
  | BooleanUnextendedValue

/**
 * Runtime value of a number schema, without extensions.
 */
export type NumberUnextendedValue = ResolvedNumberSchema
/**
 * Runtime value of a number schema, including extensions.
 */
export type NumberExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'number'>
  | NumberUnextendedValue

/**
 * Runtime value of a string schema, without extensions.
 */
export type StringUnextendedValue = ResolvedStringSchema
/**
 * Runtime value of a string schema, including extensions.
 */
export type StringExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'string'>
  | StringUnextendedValue

/**
 * Runtime value of a binary schema, without extensions.
 */
export type BinaryUnextendedValue = ResolvedBinarySchema
/**
 * Runtime value of a binary schema, including extensions.
 */
export type BinaryExtendedAttributeValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'binary'>
  | BinaryUnextendedValue

/**
 * Runtime value of a set schema, without extensions.
 */
export type SetUnextendedValue<EXTENSION extends Extension = never> = Set<
  SchemaExtendedValue<EXTENSION>
>
/**
 * Runtime value of a set schema, including extensions.
 */
export type SetExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetUnextendedValue<EXTENSION>

/**
 * Runtime value of a list schema, without extensions.
 */
export type ListUnextendedValue<EXTENSION extends Extension = never> =
  SchemaExtendedValue<EXTENSION>[]
/**
 * Runtime value of a list schema, including extensions.
 */
export type ListExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListUnextendedValue<EXTENSION>

/**
 * Runtime value of a tuple schema, without extensions.
 */
export type TupleUnextendedValue<EXTENSION extends Extension = never> =
  SchemaExtendedValue<EXTENSION>[]
/**
 * Runtime value of a tuple schema, including extensions.
 */
export type TupleExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'tuple'>
  | TupleUnextendedValue<EXTENSION>

/**
 * Runtime value of a map schema, without extensions.
 */
export type MapUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION>
}
/**
 * Runtime value of a map schema, including extensions.
 */
export type MapExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapUnextendedValue<EXTENSION>

/**
 * Runtime value of a record schema, without extensions.
 */
export type RecordUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
/**
 * Runtime value of a record schema, including extensions.
 */
export type RecordExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordUnextendedValue<EXTENSION>

/**
 * Runtime value of an item schema, without extensions.
 */
export type ItemUnextendedValue<EXTENSION extends Extension = never> = {
  [key: string]: SchemaExtendedValue<EXTENSION> | undefined
}
/**
 * Runtime value of an item schema, including extensions.
 */
export type ItemExtendedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'item'>
  | ItemUnextendedValue<EXTENSION>

/**
 * Runtime value of any schema, without extensions.
 */
export type SchemaUnextendedValue<EXTENSION extends Extension = never> =
  | NullUnextendedValue
  | BooleanUnextendedValue
  | NumberUnextendedValue
  | StringUnextendedValue
  | BinaryUnextendedValue
  | SetUnextendedValue<EXTENSION>
  | ListUnextendedValue<EXTENSION>
  | TupleUnextendedValue<EXTENSION>
  | MapUnextendedValue<EXTENSION>
  | RecordUnextendedValue<EXTENSION>
  | ItemUnextendedValue<EXTENSION>

/**
 * Runtime value of any schema, including extensions.
 */
export type SchemaExtendedValue<EXTENSION extends Extension = never> =
  | NullExtendedValue<EXTENSION>
  | BooleanExtendedValue<EXTENSION>
  | NumberExtendedValue<EXTENSION>
  | StringExtendedValue<EXTENSION>
  | BinaryExtendedAttributeValue<EXTENSION>
  | SetExtendedValue<EXTENSION>
  | ListExtendedValue<EXTENSION>
  | TupleExtendedValue<EXTENSION>
  | MapExtendedValue<EXTENSION>
  | RecordExtendedValue<EXTENSION>
  | ItemExtendedValue<EXTENSION>
