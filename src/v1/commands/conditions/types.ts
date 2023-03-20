import type { EntityV2 } from 'v1/entity'
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
} from 'v1/item'

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

export type SharedAttributeCondition<ATTRIBUTE_PATH extends string> =  // TO VERIFY: Is EXIST applyable to all types of Attributes?
  | { path: ATTRIBUTE_PATH; exists: boolean }
  | {
      path: ATTRIBUTE_PATH
      type: TypeCondition
    }
  | {
      path: ATTRIBUTE_PATH
      // TO VERIFY: Is SIZE applyable to all types of Attributes?
      size: string
    }

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
  // TO VERIFY: Can you apply clauses to Set attributes like Contains ?
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
> =
  | { path: ATTRIBUTE_PATH; lt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; lte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; gt: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; gte: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | {
      path: ATTRIBUTE_PATH
      between: [
        ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH },
        ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH }
      ]
    }

type StringOrBinaryAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute<'string'> | PrimitiveAttribute<'binary'>,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> =
  | { path: ATTRIBUTE_PATH; contains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; notContains: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; beginsWith: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }

export type PrimitiveAttributeExtraCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends ResolvedPrimitiveAttribute = ResolvePrimitiveAttribute<ATTRIBUTE>
> =
  // TO VERIFY: Are EQ | NE | IN applyable to other types than Primitives?
  | { path: ATTRIBUTE_PATH; eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
  | { path: ATTRIBUTE_PATH; in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[] }
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

export type Condition<ENTITY extends EntityV2 = EntityV2> = EntityV2 extends ENTITY
  ? AnyAttributeCondition<string, string>
  : keyof ENTITY['item']['attributes'] extends infer ATTRIBUTE_PATH
  ? ATTRIBUTE_PATH extends string
    ? AttributeCondition<
        ATTRIBUTE_PATH,
        ENTITY['item']['attributes'][ATTRIBUTE_PATH],
        AnyAttributePath<ENTITY>
      >
    : never
  : never

type AttributePath<ATTRIBUTE_PATH extends string, ATTRIBUTE extends Attribute> =
  | ATTRIBUTE_PATH
  | (ATTRIBUTE extends AnyAttribute ? `${ATTRIBUTE_PATH}${string}` : never)
  // TO VERIFY: Can you apply clauses to Set attributes like Contains ?
  | (ATTRIBUTE extends ListAttribute
      ? AttributePath<`${ATTRIBUTE_PATH}[${number}]`, ATTRIBUTE['elements']>
      : never)
  | (ATTRIBUTE extends MapAttribute
      ? {
          [KEY in keyof ATTRIBUTE['attributes']]: AttributePath<
            `${ATTRIBUTE_PATH}.${Extract<KEY, string>}`,
            ATTRIBUTE['attributes'][KEY]
          >
        }[keyof ATTRIBUTE['attributes']]
      : never)
  | (ATTRIBUTE extends RecordAttribute
      ? AttributePath<
          `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`,
          ATTRIBUTE['elements']
        >
      : never)
  | (ATTRIBUTE extends AnyOfAttribute
      ? ATTRIBUTE['elements'][number] extends infer ELEMENT
        ? ELEMENT extends Attribute
          ? AttributePath<ATTRIBUTE_PATH, ELEMENT>
          : never
        : never
      : never)

export type AnyAttributePath<
  ENTITY extends EntityV2
> = keyof ENTITY['item']['attributes'] extends infer ATTRIBUTE_PATH
  ? ATTRIBUTE_PATH extends string
    ? AttributePath<ATTRIBUTE_PATH, ENTITY['item']['attributes'][ATTRIBUTE_PATH]>
    : never
  : never

export type Conditions<ENTITY extends EntityV2 = EntityV2> =
  | Condition<ENTITY>
  | { and: Conditions<ENTITY>[] }
  | { or: Conditions<ENTITY>[] }
  | { not: Condition<ENTITY> }
