import type {
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  BinaryAttribute,
  ListAttribute,
  MapAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  ResolveBinaryAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  ResolvedBinaryAttribute,
  ResolvedNumberAttribute,
  ResolvedPrimitiveAttribute,
  ResolvedStringAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { Schema } from '~/schema/index.js'

export type AnyAttrCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrCondition<ATTRIBUTE_PATH, Exclude<Attribute, AnyAttribute>, COMPARED_ATTRIBUTE_PATH>

export type ConditionType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type AttrOrSize<ATTRIBUTE_PATH extends string> =
  | { attr: ATTRIBUTE_PATH; size?: undefined }
  | { attr?: undefined; size: ATTRIBUTE_PATH }

export type BaseAttrCondition<ATTRIBUTE_PATH extends string> = AttrOrSize<ATTRIBUTE_PATH> &
  ({ exists: boolean } | { type: ConditionType })

export type AttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends Attribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | BaseAttrCondition<ATTRIBUTE_PATH>
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttrCondition<`${ATTRIBUTE_PATH}${string}`, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends PrimitiveAttribute
      ? PrimitiveAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends SetAttribute
      ? SetAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends ListAttribute
      ? ListAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? MapAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? AnyOfAttrCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)

type SortableAttribute = StringAttribute | NumberAttribute | BinaryAttribute

type RangeCondition<
  ATTRIBUTE extends SortableAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends
    | ResolvedNumberAttribute
    | ResolvedStringAttribute
    | ResolvedBinaryAttribute =
    | (ATTRIBUTE extends NumberAttribute ? ResolveNumberAttribute<ATTRIBUTE> : never)
    | (ATTRIBUTE extends StringAttribute ? ResolveStringAttribute<ATTRIBUTE> : never)
    | (ATTRIBUTE extends BinaryAttribute ? ResolveBinaryAttribute<ATTRIBUTE> : never)
> =
  | { lt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { lte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { gt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { gte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | {
      between: [
        ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH },
        ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
      ]
    }

type StringAttrCondition<COMPARED_ATTRIBUTE_PATH extends string> =
  | { contains: string | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { beginsWith: string | { attr: COMPARED_ATTRIBUTE_PATH } }

export type PrimitiveAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> & { transform?: boolean } & (
    | { eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[] }
    | (ATTRIBUTE extends SortableAttribute
        ? RangeCondition<ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
        : never)
    | (ATTRIBUTE extends StringAttribute ? StringAttrCondition<COMPARED_ATTRIBUTE_PATH> : never)
    | (StringAttribute extends ATTRIBUTE
        ? RangeCondition<StringAttribute, string> | StringAttrCondition<string>
        : never)
    | (NumberAttribute extends ATTRIBUTE ? RangeCondition<NumberAttribute, string> : never)
    | (BinaryAttribute extends ATTRIBUTE ? RangeCondition<BinaryAttribute, string> : never)
  )

export type SetAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SetAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrOrSize<ATTRIBUTE_PATH> & {
  contains: ResolvePrimitiveAttribute<ATTRIBUTE['elements']> | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type ListAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends ListAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | (ATTRIBUTE['elements'] extends infer ELEMENTS
      ? ELEMENTS extends PrimitiveAttribute
        ? AttrOrSize<ATTRIBUTE_PATH> & {
            contains: ResolvePrimitiveAttribute<ELEMENTS> | { attr: COMPARED_ATTRIBUTE_PATH }
          }
        : never
      : never)
  // Stops recursion on general case
  | (ListAttribute extends ATTRIBUTE
      ? never
      : AttrCondition<
          `${ATTRIBUTE_PATH}[${number}]`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)

type MapAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends MapAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  MapAttribute extends ATTRIBUTE
    ? never
    : {
        [KEY in keyof ATTRIBUTE['attributes']]: AttrCondition<
          `${ATTRIBUTE_PATH}.${Extract<KEY, string>}`,
          ATTRIBUTE['attributes'][KEY],
          COMPARED_ATTRIBUTE_PATH
        >
      }[keyof ATTRIBUTE['attributes']]

type RecordAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends RecordAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  RecordAttribute extends ATTRIBUTE
    ? never
    : AttrCondition<
        `${ATTRIBUTE_PATH}.${ResolveStringAttribute<ATTRIBUTE['keys']>}`,
        ATTRIBUTE['elements'],
        COMPARED_ATTRIBUTE_PATH
      >

type AnyOfAttrCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends AnyOfAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  AnyOfAttribute extends ATTRIBUTE
    ? never
    : ATTRIBUTE['elements'][number] extends infer ELEMENT
      ? ELEMENT extends Attribute
        ? AttrCondition<ATTRIBUTE_PATH, ELEMENT, COMPARED_ATTRIBUTE_PATH>
        : never
      : never

export type NonLogicalCondition<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? AnyAttrCondition<string, string>
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
    ? ATTRIBUTE_PATH extends string
      ? AttrCondition<ATTRIBUTE_PATH, SCHEMA['attributes'][ATTRIBUTE_PATH], Paths<SCHEMA>>
      : never
    : never

export type SchemaCondition<SCHEMA extends Schema = Schema> =
  | NonLogicalCondition<SCHEMA>
  | { and: SchemaCondition<SCHEMA>[] }
  | { or: SchemaCondition<SCHEMA>[] }
  | { not: SchemaCondition<SCHEMA> }
