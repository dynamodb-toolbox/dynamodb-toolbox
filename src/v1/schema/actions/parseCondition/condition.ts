import type { Schema } from 'v1/schema/index.js'
import type {
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute
} from 'v1/schema/attributes/index.js'
import type { Paths } from 'v1/schema/actions/parsePaths/index.js'

export type AnyAttributeCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttributeCondition<
  ATTRIBUTE_PATH,
  PrimitiveAttribute | SetAttribute | ListAttribute | MapAttribute | RecordAttribute,
  COMPARED_ATTRIBUTE_PATH
>

export type ConditionType = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type AttrOrSize<ATTRIBUTE_PATH extends string> =
  | { attr: ATTRIBUTE_PATH; size?: undefined }
  | { attr?: undefined; size: ATTRIBUTE_PATH }

export type BaseAttributeCondition<ATTRIBUTE_PATH extends string> = AttrOrSize<ATTRIBUTE_PATH> &
  ({ exists: boolean } | { type: ConditionType })

export type AttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends Attribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | BaseAttributeCondition<ATTRIBUTE_PATH>
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttributeCondition<`${ATTRIBUTE_PATH}${string}`, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends PrimitiveAttribute
      ? PrimitiveAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends SetAttribute
      ? SetAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends ListAttribute
      ? ListAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? MapAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? RecordAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? AnyOfAttributeCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)

type SortableAttribute =
  | PrimitiveAttribute<'string'>
  | PrimitiveAttribute<'number'>
  | PrimitiveAttribute<'binary'>

type RangeCondition<
  ATTRIBUTE extends SortableAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
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

type StringAttributeCondition<COMPARED_ATTRIBUTE_PATH extends string> =
  | { contains: string | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { beginsWith: string | { attr: COMPARED_ATTRIBUTE_PATH } }

export type PrimitiveAttributeCondition<
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
    | (ATTRIBUTE extends PrimitiveAttribute<'string'>
        ? StringAttributeCondition<COMPARED_ATTRIBUTE_PATH>
        : never)
    // TODO: This is a bit annoying but PrimitiveAttribute is not the union of primitive Attributes (BooleanAttribute, StringAttribute etc...)
    // So we have to do this for general case:
    | (PrimitiveAttribute extends ATTRIBUTE
        ? RangeCondition<SortableAttribute, string> | StringAttributeCondition<string>
        : never)
  )

export type SetAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SetAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrOrSize<ATTRIBUTE_PATH> & {
  contains: ResolvePrimitiveAttribute<ATTRIBUTE['elements']> | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type ListAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends ListAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // TODO: Does `contain` work on non-primitive attributes?
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
      : AttributeCondition<
          `${ATTRIBUTE_PATH}[${number}]`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >)

type MapAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends MapAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  MapAttribute extends ATTRIBUTE
    ? never
    : {
        [KEY in keyof ATTRIBUTE['attributes']]: AttributeCondition<
          `${ATTRIBUTE_PATH}.${Extract<KEY, string>}`,
          ATTRIBUTE['attributes'][KEY],
          COMPARED_ATTRIBUTE_PATH
        >
      }[keyof ATTRIBUTE['attributes']]

type RecordAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends RecordAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  RecordAttribute extends ATTRIBUTE
    ? never
    : AttributeCondition<
        `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`,
        ATTRIBUTE['elements'],
        COMPARED_ATTRIBUTE_PATH
      >

type AnyOfAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends AnyOfAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Stops recursion on general case
  AnyOfAttribute extends ATTRIBUTE
    ? never
    : ATTRIBUTE['elements'][number] extends infer ELEMENT
    ? ELEMENT extends Attribute
      ? AttributeCondition<ATTRIBUTE_PATH, ELEMENT, COMPARED_ATTRIBUTE_PATH>
      : never
    : never

export type NonLogicalCondition<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? AnyAttributeCondition<string, string>
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
  ? ATTRIBUTE_PATH extends string
    ? AttributeCondition<ATTRIBUTE_PATH, SCHEMA['attributes'][ATTRIBUTE_PATH], Paths<SCHEMA>>
    : never
  : never

export type SchemaCondition<SCHEMA extends Schema = Schema> =
  | NonLogicalCondition<SCHEMA>
  | { and: SchemaCondition<SCHEMA>[] }
  | { or: SchemaCondition<SCHEMA>[] }
  | { not: SchemaCondition<SCHEMA> }
