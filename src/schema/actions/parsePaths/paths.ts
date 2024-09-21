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
  RecordAttribute,
  ResolveStringAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'

type AnyAttrPaths<
  ATTRIBUTE extends AnyAttribute,
  ATTRIBUTE_PATH extends string = ''
> = AnyAttribute extends ATTRIBUTE ? string : `${ATTRIBUTE_PATH}${string}`

// Really needed ?
type PrimitiveAttrV2Paths<
  ATTRIBUTE extends
    | NullAttribute
    | BooleanAttribute
    | NumberAttribute
    | StringAttribute
    | BinaryAttribute
> =
  | NullAttribute
  | BooleanAttribute
  | NumberAttribute
  | StringAttribute
  | BinaryAttribute extends ATTRIBUTE
  ? string
  : never

type SetAttrPaths<ATTRIBUTE extends SetAttribute> = SetAttribute extends ATTRIBUTE ? string : never

type ListAttrPaths<
  ATTRIBUTE extends ListAttribute,
  ATTRIBUTE_PATH extends string = ''
> = ListAttribute extends ATTRIBUTE
  ? string
  :
      | `${ATTRIBUTE_PATH}[${number}]`
      | AttrPaths<ATTRIBUTE['elements'], `${ATTRIBUTE_PATH}[${number}]`>

type MapAttrPaths<
  ATTRIBUTE extends MapAttribute,
  ATTRIBUTE_PATH extends string = ''
> = MapAttribute extends ATTRIBUTE
  ? string
  : {
      [KEY in keyof ATTRIBUTE['attributes'] & string]:
        | `${ATTRIBUTE_PATH}.${KEY}`
        | AttrPaths<ATTRIBUTE['attributes'][KEY], `${ATTRIBUTE_PATH}.${KEY}`>
    }[keyof ATTRIBUTE['attributes'] & string]

type RecordAttrPaths<
  ATTRIBUTE extends RecordAttribute,
  ATTRIBUTE_PATH extends string = ''
> = RecordAttribute extends ATTRIBUTE
  ? string
  :
      | `${ATTRIBUTE_PATH}.${ResolveStringAttribute<ATTRIBUTE['keys']>}`
      | AttrPaths<
          ATTRIBUTE['elements'],
          `${ATTRIBUTE_PATH}.${ResolveStringAttribute<ATTRIBUTE['keys']>}`
        >

type AnyOfAttrPaths<
  ATTRIBUTE extends AnyOfAttribute,
  ATTRIBUTE_PATH extends string = ''
> = AnyOfAttribute extends ATTRIBUTE
  ? string
  : AnyOfAttrPathsRec<ATTRIBUTE['elements'], ATTRIBUTE_PATH>

type AnyOfAttrPathsRec<
  ATTRIBUTES extends Attribute[],
  ATTRIBUTE_PATH extends string = '',
  RESULTS = never
> = ATTRIBUTES extends [infer ATTRIBUTES_HEAD, ...infer ATTRIBUTES_TAIL]
  ? ATTRIBUTES_HEAD extends Attribute
    ? ATTRIBUTES_TAIL extends Attribute[]
      ? AnyOfAttrPathsRec<
          ATTRIBUTES_TAIL,
          ATTRIBUTE_PATH,
          RESULTS | AttrPaths<ATTRIBUTES_HEAD, ATTRIBUTE_PATH>
        >
      : never
    : never
  : RESULTS

export type AttrPaths<
  ATTRIBUTE extends Attribute,
  ATTRIBUTE_PATH extends string = ''
> = ATTRIBUTE extends AnyAttribute
  ? AnyAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
  : ATTRIBUTE extends
        | NullAttribute
        | BooleanAttribute
        | NumberAttribute
        | StringAttribute
        | BinaryAttribute
    ? PrimitiveAttrV2Paths<ATTRIBUTE>
    : ATTRIBUTE extends SetAttribute
      ? SetAttrPaths<ATTRIBUTE>
      : ATTRIBUTE extends ListAttribute
        ? ListAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
        : ATTRIBUTE extends MapAttribute
          ? MapAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
          : ATTRIBUTE extends RecordAttribute
            ? RecordAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
            : ATTRIBUTE extends AnyOfAttribute
              ? AnyOfAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
              : never

export type SchemaPaths<SCHEMA extends Schema = Schema> = Schema extends SCHEMA
  ? string
  : keyof SCHEMA['attributes'] extends infer ATTRIBUTE_PATH
    ? ATTRIBUTE_PATH extends string
      ? ATTRIBUTE_PATH | AttrPaths<SCHEMA['attributes'][ATTRIBUTE_PATH], ATTRIBUTE_PATH>
      : never
    : never

// string is there to simplify type-constraint checks when using Paths
export type Paths<SCHEMA extends Schema | Attribute = Schema | Attribute> = string &
  (SCHEMA extends Schema
    ? SchemaPaths<SCHEMA>
    : SCHEMA extends Attribute
      ? AttrPaths<SCHEMA>
      : never)
