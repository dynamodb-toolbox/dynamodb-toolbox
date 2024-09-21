import type {
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  ListAttribute,
  MapAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  ResolvedNumberAttribute,
  ResolvedPrimitiveAttribute,
  ResolvedStringAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Paths } from '~/schema/actions/parsePaths/index.js'
import type { Schema } from '~/schema/index.js'

export type AnyAttributeCondition<
  ATTRIBUTE_PATH extends string,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttributeCondition<
  ATTRIBUTE_PATH,
  | NumberAttribute
  | StringAttribute
  | PrimitiveAttribute
  | SetAttribute
  | ListAttribute
  | MapAttribute
  | RecordAttribute,
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
  | (ATTRIBUTE extends NumberAttribute | PrimitiveAttribute | StringAttribute
      ? PrimitiveAttributeV2Condition<ATTRIBUTE_PATH, ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
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

type SortableAttribute = StringAttribute | NumberAttribute | PrimitiveAttribute<'binary'>

type RangeCondition<
  ATTRIBUTE extends SortableAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute =
    | (ATTRIBUTE extends PrimitiveAttribute<'binary'>
        ? ResolvePrimitiveAttribute<ATTRIBUTE>
        : never)
    | (ATTRIBUTE extends NumberAttribute ? ResolveNumberAttribute<ATTRIBUTE> : never)
    | (ATTRIBUTE extends StringAttribute ? ResolveStringAttribute<ATTRIBUTE> : never)
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

export type PrimitiveAttributeV2Condition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends PrimitiveAttribute | NumberAttribute | StringAttribute,
  COMPARED_ATTRIBUTE_PATH extends string,
  ATTRIBUTE_VALUE extends
    | ResolvedPrimitiveAttribute
    | ResolvedNumberAttribute
    | ResolvedStringAttribute =
    | (ATTRIBUTE extends PrimitiveAttribute ? ResolvePrimitiveAttribute<ATTRIBUTE> : never)
    | (ATTRIBUTE extends NumberAttribute ? ResolveNumberAttribute<ATTRIBUTE> : never)
    | (ATTRIBUTE extends StringAttribute ? ResolveStringAttribute<ATTRIBUTE> : never)
> = AttrOrSize<ATTRIBUTE_PATH> & { transform?: boolean } & (
    | { eq: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { ne: ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH } }
    | { in: (ATTRIBUTE_VALUE | { attr: COMPARED_ATTRIBUTE_PATH })[] }
    | (ATTRIBUTE extends SortableAttribute
        ? RangeCondition<ATTRIBUTE, COMPARED_ATTRIBUTE_PATH>
        : never)
    | (ATTRIBUTE extends StringAttribute
        ? StringAttributeCondition<COMPARED_ATTRIBUTE_PATH>
        : never)
    /**
     * @debt type "Annoying: PrimitiveAttribute is not the union of primitive Attributes (BooleanAttribute, StringAttribute etc...). So we have to do this for general case."
     */
    | (PrimitiveAttribute<'binary'> extends ATTRIBUTE
        ? RangeCondition<PrimitiveAttribute<'binary'>, string>
        : never)
    | (StringAttribute extends ATTRIBUTE
        ? RangeCondition<StringAttribute, string> | StringAttributeCondition<string>
        : never)
    | (NumberAttribute extends ATTRIBUTE ? RangeCondition<NumberAttribute, string> : never)
  )

export type SetAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends SetAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> = AttrOrSize<ATTRIBUTE_PATH> & {
  contains:
    | (ATTRIBUTE['elements'] extends PrimitiveAttribute
        ? ResolvePrimitiveAttribute<ATTRIBUTE['elements']>
        : ATTRIBUTE['elements'] extends NumberAttribute
          ? ResolveNumberAttribute<ATTRIBUTE['elements']>
          : ATTRIBUTE['elements'] extends StringAttribute
            ? ResolveStringAttribute<ATTRIBUTE['elements']>
            : never)
    | { attr: COMPARED_ATTRIBUTE_PATH }
}

export type ListAttributeCondition<
  ATTRIBUTE_PATH extends string,
  ATTRIBUTE extends ListAttribute,
  COMPARED_ATTRIBUTE_PATH extends string
> =
  // Necessary to distribute the union?
  | (ATTRIBUTE['elements'] extends infer ELEMENTS
      ? ELEMENTS extends PrimitiveAttribute
        ? AttrOrSize<ATTRIBUTE_PATH> & {
            contains: ResolvePrimitiveAttribute<ELEMENTS> | { attr: COMPARED_ATTRIBUTE_PATH }
          }
        : ELEMENTS extends NumberAttribute
          ? AttrOrSize<ATTRIBUTE_PATH> & {
              contains: ResolveNumberAttribute<ELEMENTS> | { attr: COMPARED_ATTRIBUTE_PATH }
            }
          : ELEMENTS extends StringAttribute
            ? AttrOrSize<ATTRIBUTE_PATH> & {
                contains: ResolveStringAttribute<ELEMENTS> | { attr: COMPARED_ATTRIBUTE_PATH }
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
        `${ATTRIBUTE_PATH}.${ResolveStringAttribute<ATTRIBUTE['keys']>}`,
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
