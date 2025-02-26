import type {
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  BinarySchema,
  BooleanSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
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
  SetSchema,
  StringSchema
} from '~/attributes/index.js'
import type { AppendKey, Paths, Schema, StringToEscape } from '~/schema/index.js'
import type { Extends, If } from '~/types/index.js'

export type AnySchemaCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrCondition<ATTRIBUTE_PATH, Exclude<AttrSchema, AnySchema>, COMPARED_ATTRIBUTE_PATH>

export type ConditionType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type Size<ATTRIBUTE_PATH extends string> = { attr?: undefined; size: ATTRIBUTE_PATH }

export type Attr<ATTRIBUTE_PATH extends string> = { attr: ATTRIBUTE_PATH; size?: undefined }

export type AttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends AttrSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | (ATTRIBUTE extends AnySchema
      ? AnySchemaCondition<`${ATTRIBUTE_PATH}${string}`, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends NullSchema ? NullSchemaCondition<ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends BooleanSchema
      ? BooleanSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends NumberSchema
      ? NumberSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends StringSchema
      ? StringSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends BinarySchema
      ? BinarySchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends SetSchema
      ? SetSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends ListSchema
      ? ListSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends MapSchema
      ? MapSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends RecordSchema
      ? RecordSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends AnyOfSchema
      ? AnyOfSchemaCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)

export type ExistsCondition<ATTRIBUTE_PATH extends string> = {
  attr: ATTRIBUTE_PATH
  exists: boolean
}

export type TypeCondition<ATTRIBUTE_PATH extends string> = {
  attr: ATTRIBUTE_PATH
  type: ConditionType
}

export type EqCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeEqCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> = {
  size: ATTRIBUTE_PATH
  eq: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type NotEqCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeNotEqCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> = {
  size: ATTRIBUTE_PATH
  ne: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type InCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[]
  transform?: boolean
}

type SizeInCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> = {
  size: ATTRIBUTE_PATH
  in: (ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH })[]
}

export type ValueCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | EqCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | NotEqCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | InCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>

type SizeValueCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> =
  | SizeEqCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeNotEqCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeInCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type LessThanCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  lt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeLessThanCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  size: ATTRIBUTE_PATH
  lt: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type LessThanOrEqCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  lte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeLessThanOrEqCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  size: ATTRIBUTE_PATH
  lte: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type GreaterThanCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  gt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeGreaterThanCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  size: ATTRIBUTE_PATH
  gt: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type GreaterThanOrEqCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  gte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

type SizeGreaterThanOrEqCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  size: ATTRIBUTE_PATH
  gte: ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type BetweenCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  between: [
    ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH },
    ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  ]
  transform?: boolean
}

type SizeBetweenCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> = {
  size: ATTRIBUTE_PATH
  between: [
    ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH },
    ResolvedNumberSchema | { attr: COMPARED_ATTRIBUTE_PATH }
  ]
}

export type RangeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | LessThanCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | LessThanOrEqCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | GreaterThanCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | GreaterThanOrEqCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>
  | BetweenCondition<ATTRIBUTE_PATH, ATTRIBUTE_VALUE, COMPARED_ATTRIBUTE_PATH>

type SizeRangeCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> =
  | SizeLessThanCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeLessThanOrEqCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeGreaterThanCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeGreaterThanOrEqCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeBetweenCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type SizeCondition<ATTRIBUTE_PATH extends string, COMPARED_ATTRIBUTE_PATH extends string> =
  | SizeValueCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>
  | SizeRangeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type NullSchemaCondition<ATTRIBUTE_PATH extends string> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>

export type BooleanSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends BooleanSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveBooleanSchema<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>

export type NumberSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends NumberSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveNumberSchema<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedNumberSchema, COMPARED_ATTRIBUTE_PATH>

export type ContainsCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  contains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

export type BeginsWithCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE,
  COMPARED_ATTRIBUTE_PATH extends string
> = {
  attr: ATTRIBUTE_PATH
  beginsWith: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
  transform?: boolean
}

export type StringSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends StringSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveStringSchema<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedStringSchema, COMPARED_ATTRIBUTE_PATH>
  | BeginsWithCondition<ATTRIBUTE_PATH, ResolvedStringSchema, COMPARED_ATTRIBUTE_PATH>
  | ContainsCondition<ATTRIBUTE_PATH, ResolvedStringSchema, COMPARED_ATTRIBUTE_PATH>
  // "If the attribute is of type `String`, `size` returns the length of the string"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type BinarySchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends BinarySchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveBinarySchema<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedBinarySchema, COMPARED_ATTRIBUTE_PATH>
  // "If the attribute is of type `Binary`, `size` returns the number of bytes in the attribute value"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type SetSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SetSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ContainsCondition<
      ATTRIBUTE_PATH,
      ResolvePrimitiveSchema<ATTRIBUTE['elements']>,
      COMPARED_ATTRIBUTE_PATH
    >
  // "If the attribute is a `Set` data type, `size` returns the number of elements in the set"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type ListSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends ListSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | (ATTRIBUTE['elements'] extends PrimitiveSchema
      ? ContainsCondition<
          ATTRIBUTE_PATH,
          ResolvePrimitiveSchema<ATTRIBUTE['elements']>,
          COMPARED_ATTRIBUTE_PATH
        >
      : never)
  // Stops recursion on general case
  | (ListSchema extends ATTRIBUTE
      ? never
      : AttrCondition<
          `${ATTRIBUTE_PATH}[${number}]`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type MapSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends MapSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (MapSchema extends ATTRIBUTE
      ? never
      : {
          [KEY in keyof ATTRIBUTE['attributes'] & string]: AttrCondition<
            AppendKey<ATTRIBUTE_PATH, KEY>,
            ATTRIBUTE['attributes'][KEY],
            COMPARED_ATTRIBUTE_PATH
          >
        }[keyof ATTRIBUTE['attributes'] & string])
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type RecordSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends RecordSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (RecordSchema extends ATTRIBUTE
      ? never
      : AttrCondition<
          AppendKey<ATTRIBUTE_PATH, ResolveStringSchema<ATTRIBUTE['keys']>>,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type AnyOfSchemaCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends AnyOfSchema,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (AnyOfSchema extends ATTRIBUTE
      ? never
      : ATTRIBUTE['elements'][number] extends infer ELEMENT
        ? ELEMENT extends AttrSchema
          ? AttrCondition<ATTRIBUTE_PATH, ELEMENT, COMPARED_ATTRIBUTE_PATH>
          : never
        : never)

export type NonLogicalCondition<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? AnySchemaCondition<string, string>
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
    ? ATTRIBUTE_PATH extends string
      ? AttrCondition<
          | `['${ATTRIBUTE_PATH}']`
          | If<Extends<ATTRIBUTE_PATH, StringToEscape>, never, ATTRIBUTE_PATH>,
          SCHEMA['attributes'][ATTRIBUTE_PATH],
          Paths<SCHEMA>
        >
      : never
    : never

export type SchemaCondition<SCHEMA extends Schema = Schema> =
  | NonLogicalCondition<SCHEMA>
  | { and: SchemaCondition<SCHEMA>[] }
  | { or: SchemaCondition<SCHEMA>[] }
  | { not: SchemaCondition<SCHEMA> }
