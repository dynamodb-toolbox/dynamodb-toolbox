import type { EntityV2 } from 'v1/entity'
import type {
  Schema,
  AnyAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  Attribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  PrimitiveAttribute
} from 'v1/schema'
import type { SchemaAttributePath } from './paths'

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
   * @debt feature "Can you apply Contains clauses to Set attributes?"
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

type NumberStringOrBinaryAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends
    | PrimitiveAttribute<'number'>
    | PrimitiveAttribute<'string'>
    | PrimitiveAttribute<'binary'>,
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

type StringOrBinaryAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute<'string'> | PrimitiveAttribute<'binary'>,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> &
  (
    | { contains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { notContains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { beginsWith: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  )

export type PrimitiveAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> = AttrOrSize<ATTRIBUTE_PATH> & { transform?: boolean } & (
    | // TO VERIFY: Are EQ | NE | IN applyable to other types than Primitives?
    { eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[] }
    | (ATTRIBUTE extends
        | PrimitiveAttribute<'string'>
        | PrimitiveAttribute<'number'>
        | PrimitiveAttribute<'binary'>
        ? NumberStringOrBinaryAttributeExtraCondition<
            ATTRIBUTE_PATH,
            ATTRIBUTE,
            COMPARED_ATTRIBUTE_PATH
          >
        : never)
    | (ATTRIBUTE extends PrimitiveAttribute<'string'> | PrimitiveAttribute<'binary'>
        ? StringOrBinaryAttributeExtraCondition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
        : never)
  )

export type NonLogicalCondition<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? AnyAttributeCondition<string, string>
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
  ? ATTRIBUTE_PATH extends string
    ? AttributeCondition<
        ATTRIBUTE_PATH,
        SCHEMA['attributes'][ATTRIBUTE_PATH],
        SchemaAttributePath<SCHEMA>
      >
    : never
  : never

export type SchemaCondition<SCHEMA extends Schema = Schema> =
  | NonLogicalCondition<SCHEMA>
  | { and: SchemaCondition<SCHEMA>[] }
  | { or: SchemaCondition<SCHEMA>[] }
  | { not: SchemaCondition<SCHEMA> }

export type Condition<ENTITY extends EntityV2 = EntityV2> = SchemaCondition<ENTITY['schema']>

export interface ConditionOptions<ENTITY extends EntityV2 = EntityV2> {
  /** Optional condition to apply to the operation */
  condition?: Condition<ENTITY>
}
