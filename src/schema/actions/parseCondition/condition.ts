import type {
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  MapAttribute,
  NullAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  ResolveBinaryAttribute,
  ResolveBooleanAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  ResolvedBinaryAttribute,
  ResolvedNumberAttribute,
  ResolvedStringAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { AppendKey, Paths, Schema, StringToEscape } from '~/schema/index.js'
import type { Extends, If } from '~/types/index.js'

export type AnyAttrCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrCondition<ATTRIBUTE_PATH, Exclude<Attribute, AnyAttribute>, COMPARED_ATTRIBUTE_PATH>

export type ConditionType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type Size<ATTRIBUTE_PATH extends string> = { attr?: undefined; size: ATTRIBUTE_PATH }

export type Attr<ATTRIBUTE_PATH extends string> = { attr: ATTRIBUTE_PATH; size?: undefined }

export type AttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends Attribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttrCondition<`${ATTRIBUTE_PATH}${string}`, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends NullAttribute ? NullAttrCondition<ATTRIBUTE_PATH> : never)
  | (ATTRIBUTE extends BooleanAttribute
      ? BooleanAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends NumberAttribute
      ? NumberAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends StringAttribute
      ? StringAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends BinaryAttribute
      ? BinaryAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends SetAttribute
      ? SetAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends ListAttribute
      ? ListAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends MapAttribute
      ? MapAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  // Size ok
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? AnyOfAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
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
  eq: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
  ne: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
  in: (ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH })[]
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
  lt: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
  lte: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
  gt: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
  gte: ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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
    ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH },
    ResolvedNumberAttribute | { attr: COMPARED_ATTRIBUTE_PATH }
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

export type NullAttrCondition<ATTRIBUTE_PATH extends string> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>

export type BooleanAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends BooleanAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveBooleanAttribute<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>

export type NumberAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends NumberAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveNumberAttribute<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedNumberAttribute, COMPARED_ATTRIBUTE_PATH>

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

export type StringAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends StringAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveStringAttribute<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedStringAttribute, COMPARED_ATTRIBUTE_PATH>
  | BeginsWithCondition<ATTRIBUTE_PATH, ResolvedStringAttribute, COMPARED_ATTRIBUTE_PATH>
  | ContainsCondition<ATTRIBUTE_PATH, ResolvedStringAttribute, COMPARED_ATTRIBUTE_PATH>
  // "If the attribute is of type `String`, `size` returns the length of the string"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type BinaryAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends BinaryAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ValueCondition<ATTRIBUTE_PATH, ResolveBinaryAttribute<ATTRIBUTE>, COMPARED_ATTRIBUTE_PATH>
  | RangeCondition<ATTRIBUTE_PATH, ResolvedBinaryAttribute, COMPARED_ATTRIBUTE_PATH>
  // "If the attribute is of type `Binary`, `size` returns the number of bytes in the attribute value"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type SetAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SetAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | ContainsCondition<
      ATTRIBUTE_PATH,
      ResolvePrimitiveAttribute<ATTRIBUTE['elements']>,
      COMPARED_ATTRIBUTE_PATH
    >
  // "If the attribute is a `Set` data type, `size` returns the number of elements in the set"
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type ListAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends ListAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  | (ATTRIBUTE['elements'] extends PrimitiveAttribute
      ? ContainsCondition<
          ATTRIBUTE_PATH,
          ResolvePrimitiveAttribute<ATTRIBUTE['elements']>,
          COMPARED_ATTRIBUTE_PATH
        >
      : never)
  // Stops recursion on general case
  | (ListAttribute extends ATTRIBUTE
      ? never
      : AttrCondition<
          `${ATTRIBUTE_PATH}[${number}]`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type MapAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends MapAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (MapAttribute extends ATTRIBUTE
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

export type RecordAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends RecordAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (RecordAttribute extends ATTRIBUTE
      ? never
      : AttrCondition<
          AppendKey<ATTRIBUTE_PATH, ResolveStringAttribute<ATTRIBUTE['keys']>>,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)
  // "If the attribute is of type `List` or `Map`, `size` returns the number of child elements.""
  | SizeCondition<ATTRIBUTE_PATH, COMPARED_ATTRIBUTE_PATH>

export type AnyOfAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends AnyOfAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | ExistsCondition<ATTRIBUTE_PATH>
  | TypeCondition<ATTRIBUTE_PATH>
  // Stops recursion on general case
  | (AnyOfAttribute extends ATTRIBUTE
      ? never
      : ATTRIBUTE['elements'][number] extends infer ELEMENT
        ? ELEMENT extends Attribute
          ? AttrCondition<ATTRIBUTE_PATH, ELEMENT, COMPARED_ATTRIBUTE_PATH>
          : never
        : never)

export type NonLogicalCondition<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? AnyAttrCondition<string, string>
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
