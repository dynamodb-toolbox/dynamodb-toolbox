import type {
  AnyOfSchema,
  AnySchema,
  AppendKey,
  BinarySchema,
  BooleanSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  Paths,
  PrimitiveSchema,
  RecordSchema,
  ResolveBinarySchema,
  ResolveBooleanSchema,
  ResolveNumberSchema,
  ResolvePrimitiveSchema,
  ResolveStringSchema,
  ResolvedBinarySchema,
  ResolvedNumberSchema,
  ResolvedStringSchema,
  Schema,
  SetSchema,
  StringSchema,
  StringToEscape
} from '~/schema/index.js'
import type { Extends, If } from '~/types/index.js'

export type AnySchemaCondition<ATTR_PATH extends string, ALL_PATHS extends string> = AttrCondition<
  ATTR_PATH,
  Exclude<Schema, AnySchema>,
  ALL_PATHS
>

export type ConditionType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type AttrCondition<
  ATTR_PATH extends string,
  SCHEMA extends Schema,
  ALL_PATHS extends string
> =
  | (SCHEMA extends AnySchema ? AnySchemaCondition<`${ATTR_PATH}${string}`, ALL_PATHS> : never)
  | (SCHEMA extends NullSchema ? NullSchemaCondition<ATTR_PATH> : never)
  | (SCHEMA extends BooleanSchema ? BooleanSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  | (SCHEMA extends NumberSchema ? NumberSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends StringSchema ? StringSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends BinarySchema ? BinarySchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends SetSchema ? SetSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends ListSchema ? ListSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends MapSchema ? MapSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  // Size ok
  | (SCHEMA extends RecordSchema ? RecordSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)
  | (SCHEMA extends AnyOfSchema ? AnyOfSchemaCondition<ATTR_PATH, SCHEMA, ALL_PATHS> : never)

export type ExistsCondition<ATTR_PATH extends string> = {
  attr: ATTR_PATH
  exists: boolean
}

export type TypeCondition<ATTR_PATH extends string> = {
  attr: ATTR_PATH
  type: ConditionType
}

export type EqCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  eq: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeEqCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  eq: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type NotEqCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  ne: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeNotEqCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  ne: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type InCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  in: (ATTR_VALUE | { attr: ALL_PATHS })[]
  transform?: boolean
}

type SizeInCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  in: (ResolvedNumberSchema | { attr: ALL_PATHS })[]
}

export type ValueCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> =
  | EqCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | NotEqCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | InCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>

type SizeValueCondition<ATTR_PATH extends string, ALL_PATHS extends string> =
  | SizeEqCondition<ATTR_PATH, ALL_PATHS>
  | SizeNotEqCondition<ATTR_PATH, ALL_PATHS>
  | SizeInCondition<ATTR_PATH, ALL_PATHS>

export type LessThanCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  lt: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeLessThanCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  lt: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type LessThanOrEqCondition<
  ATTR_PATH extends string,
  ATTR_VALUE,
  ALL_PATHS extends string
> = {
  attr: ATTR_PATH
  lte: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeLessThanOrEqCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  lte: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type GreaterThanCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  gt: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeGreaterThanCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  gt: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type GreaterThanOrEqCondition<
  ATTR_PATH extends string,
  ATTR_VALUE,
  ALL_PATHS extends string
> = {
  attr: ATTR_PATH
  gte: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

type SizeGreaterThanOrEqCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  gte: ResolvedNumberSchema | { attr: ALL_PATHS }
}

export type BetweenCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  between: [ATTR_VALUE | { attr: ALL_PATHS }, ATTR_VALUE | { attr: ALL_PATHS }]
  transform?: boolean
}

type SizeBetweenCondition<ATTR_PATH extends string, ALL_PATHS extends string> = {
  size: ATTR_PATH
  between: [ResolvedNumberSchema | { attr: ALL_PATHS }, ResolvedNumberSchema | { attr: ALL_PATHS }]
}

export type RangeCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> =
  | LessThanCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | LessThanOrEqCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | GreaterThanCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | GreaterThanOrEqCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>
  | BetweenCondition<ATTR_PATH, ATTR_VALUE, ALL_PATHS>

type SizeRangeCondition<ATTR_PATH extends string, ALL_PATHS extends string> =
  | SizeLessThanCondition<ATTR_PATH, ALL_PATHS>
  | SizeLessThanOrEqCondition<ATTR_PATH, ALL_PATHS>
  | SizeGreaterThanCondition<ATTR_PATH, ALL_PATHS>
  | SizeGreaterThanOrEqCondition<ATTR_PATH, ALL_PATHS>
  | SizeBetweenCondition<ATTR_PATH, ALL_PATHS>

export type SizeCondition<ATTR_PATH extends string, ALL_PATHS extends string> =
  | SizeValueCondition<ATTR_PATH, ALL_PATHS>
  | SizeRangeCondition<ATTR_PATH, ALL_PATHS>

export type NullSchemaCondition<ATTR_PATH extends string> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>

export type BooleanSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends BooleanSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | ValueCondition<ATTR_PATH, ResolveBooleanSchema<SCHEMA>, ALL_PATHS>

export type NumberSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends NumberSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | ValueCondition<ATTR_PATH, ResolveNumberSchema<SCHEMA>, ALL_PATHS>
  | RangeCondition<ATTR_PATH, ResolvedNumberSchema, ALL_PATHS>

export type ContainsCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  contains: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

export type BeginsWithCondition<ATTR_PATH extends string, ATTR_VALUE, ALL_PATHS extends string> = {
  attr: ATTR_PATH
  beginsWith: ATTR_VALUE | { attr: ALL_PATHS }
  transform?: boolean
}

export type StringSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends StringSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | ValueCondition<ATTR_PATH, ResolveStringSchema<SCHEMA>, ALL_PATHS>
  | RangeCondition<ATTR_PATH, ResolvedStringSchema, ALL_PATHS>
  | BeginsWithCondition<ATTR_PATH, ResolvedStringSchema, ALL_PATHS>
  | ContainsCondition<ATTR_PATH, ResolvedStringSchema, ALL_PATHS>
  // "If the attribute is of type `String`, `size` returns the length of the string"
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type BinarySchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends BinarySchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | ValueCondition<ATTR_PATH, ResolveBinarySchema<SCHEMA>, ALL_PATHS>
  | RangeCondition<ATTR_PATH, ResolvedBinarySchema, ALL_PATHS>
  // "If the attribute is of type `Binary`, `size` returns the number of bytes in the attribute value"
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type SetSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends SetSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | ContainsCondition<ATTR_PATH, ResolvePrimitiveSchema<SCHEMA['elements']>, ALL_PATHS>
  // "If the attribute is a `Set` data type, `size` returns the number of elements in the set"
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type ListSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends ListSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  | (SCHEMA['elements'] extends PrimitiveSchema
      ? ContainsCondition<ATTR_PATH, ResolvePrimitiveSchema<SCHEMA['elements']>, ALL_PATHS>
      : never)
  // Stops recursion on general case
  | (ListSchema extends SCHEMA
      ? never
      : AttrCondition<`${ATTR_PATH}[${number}]`, SCHEMA['elements'], ALL_PATHS>)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type MapSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends MapSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  // Stops recursion on general case
  | (MapSchema extends SCHEMA
      ? never
      : {
          [KEY in keyof SCHEMA['attributes'] & string]: AttrCondition<
            AppendKey<ATTR_PATH, KEY>,
            SCHEMA['attributes'][KEY],
            ALL_PATHS
          >
        }[keyof SCHEMA['attributes'] & string])
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type RecordSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends RecordSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  // Stops recursion on general case
  | (RecordSchema extends SCHEMA
      ? never
      : AttrCondition<
          AppendKey<ATTR_PATH, ResolveStringSchema<SCHEMA['keys']>>,
          SCHEMA['elements'],
          ALL_PATHS
        >)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTR_PATH, ALL_PATHS>

export type AnyOfSchemaCondition<
  ATTR_PATH extends string,
  SCHEMA extends AnyOfSchema,
  ALL_PATHS extends string
> =
  | ExistsCondition<ATTR_PATH>
  | TypeCondition<ATTR_PATH>
  // Stops recursion on general case
  | (AnyOfSchema extends SCHEMA
      ? never
      : SCHEMA['elements'][number] extends infer ELEMENT
        ? ELEMENT extends Schema
          ? AttrCondition<ATTR_PATH, ELEMENT, ALL_PATHS>
          : never
        : never)

export type NonLogicalCondition<SCHEMA extends ItemSchema = ItemSchema> = ItemSchema extends SCHEMA
  ? AnySchemaCondition<string, string>
  : keyof SCHEMA['attributes'] extends infer ATTR_PATH
    ? ATTR_PATH extends string
      ? AttrCondition<
          `['${ATTR_PATH}']` | If<Extends<ATTR_PATH, StringToEscape>, never, ATTR_PATH>,
          SCHEMA['attributes'][ATTR_PATH],
          Paths<SCHEMA>
        >
      : never
    : never

export type SchemaCondition<SCHEMA extends ItemSchema = ItemSchema> =
  | NonLogicalCondition<SCHEMA>
  | { and: SchemaCondition<SCHEMA>[] }
  | { or: SchemaCondition<SCHEMA>[] }
  | { not: SchemaCondition<SCHEMA> }
