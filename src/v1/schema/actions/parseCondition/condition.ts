import type { Schema } from 'v1/schema'
import type {
  AnyAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Attribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute
} from 'v1/schema/attributes'
import type { Paths } from 'v1/schema/actions/parsePaths'

export type AnyAttributeCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | AttributeCondition<ATTRIBUTE_PATH, never, COMPARED_ATTRIBUTE_PATH>
  | PrimitiveAttributeExtraCondition<
      ATTRIBUTE_PATH,
      | PrimitiveAttribute<'boolean'>
      | PrimitiveAttribute<'number'>
      | PrimitiveAttribute<'string'>
      | PrimitiveAttribute<'binary'>,
      COMPARED_ATTRIBUTE_PATH
    >

export type TypeCondition = 'S' | 'SS' | 'N' | 'NS' | 'B' | 'BS' | 'BOOL' | 'NULL' | 'L' | 'M'

export type AttrOrSize<ATTRIBUTE_PATH extends string> =
  | { attr: ATTRIBUTE_PATH; size?: undefined }
  | { attr?: undefined; size: ATTRIBUTE_PATH }

export type SharedAttributeCondition<ATTRIBUTE_PATH extends string> = AttrOrSize<ATTRIBUTE_PATH> &
  (
    | // TO VERIFY: Is EXIST applyable to all types of Attributes?
    { exists: boolean }
    | { type: TypeCondition }
    // TO VERIFY: Is SIZE applyable to all types of Attributes?
    | { size: string }
  )

export type AttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends Attribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  | SharedAttributeCondition<ATTRIBUTE_PATH>
  | (ATTRIBUTE extends AnyAttribute
      ? AnyAttributeCondition<`${ATTRIBUTE_PATH}${string}`, COMPARED_ATTRIBUTE_PATH>
      : never)
  | (ATTRIBUTE extends PrimitiveAttribute
      ? PrimitiveAttributeExtraCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
      : never)
  /**
   * @debt feature "Develop Contains clauses on Set attributes"
   */
  | (ATTRIBUTE extends ListAttribute
      ? AttributeCondition<
          `${ATTRIBUTE_PATH}[${number}]`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? {
          [KEY in keyof ATTRIBUTE['attributes']]: AttributeCondition<
            `${ATTRIBUTE_PATH}.${Extract<KEY, string>}`,
            ATTRIBUTE['attributes'][KEY],
            COMPARED_ATTRIBUTE_PATH
          >
        }[keyof ATTRIBUTE['attributes']]
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? AttributeCondition<
          `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`,
          ATTRIBUTE['elements'],
          COMPARED_ATTRIBUTE_PATH
        >
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? ATTRIBUTE['elements'][number] extends infer ELEMENT
        ? ELEMENT extends Attribute
          ? AttributeCondition<ATTRIBUTE_PATH, ELEMENT, COMPARED_ATTRIBUTE_PATH>
          : never
        : never
      : never)

type SortableAttribute =
  | PrimitiveAttribute<'string'>
  | PrimitiveAttribute<'number'>
  | PrimitiveAttribute<'binary'>

type SortableAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SortableAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> &
  (
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
  )

// TODO: It's actually only string Attributes
type StringOrBinaryAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute<'string'> | PrimitiveAttribute<'binary'>,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> &
  (
    | { contains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { beginsWith: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  )

export type PrimitiveAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> & { transform?: boolean } & (
    | { eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[] }
    | (ATTRIBUTE extends SortableAttribute
        ? SortableAttributeExtraCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
        : never)
    | (ATTRIBUTE extends PrimitiveAttribute<'string'> | PrimitiveAttribute<'binary'>
        ? StringOrBinaryAttributeExtraCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
        : never)
  )

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
