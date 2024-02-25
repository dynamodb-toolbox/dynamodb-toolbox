import type {
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  ResolvePrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute
} from 'v1/schema/attributes'
import type { Schema } from 'v1/schema/schema'

type AnyAttrPaths<
  ATTRIBUTE extends AnyAttribute,
  ATTRIBUTE_PATH extends string = ''
> = AnyAttribute extends ATTRIBUTE ? string : `${ATTRIBUTE_PATH}${string}`

type PrimitiveAttrPaths<ATTRIBUTE extends PrimitiveAttribute> = PrimitiveAttribute extends ATTRIBUTE
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
      | `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`
      | AttrPaths<
          ATTRIBUTE['elements'],
          `${ATTRIBUTE_PATH}.${ResolvePrimitiveAttribute<ATTRIBUTE['keys']>}`
        >

type AnyOfAttrPaths<
  ATTRIBUTE extends AnyOfAttribute,
  ATTRIBUTE_PATH extends string = ''
> = AnyOfAttribute extends ATTRIBUTE
  ? string
  : AttrPaths<ATTRIBUTE['elements'][number], ATTRIBUTE_PATH>

export type AttrPaths<
  ATTRIBUTE extends Attribute,
  ATTRIBUTE_PATH extends string = ''
> = ATTRIBUTE extends AnyAttribute
  ? AnyAttrPaths<ATTRIBUTE, ATTRIBUTE_PATH>
  : ATTRIBUTE extends PrimitiveAttribute
  ? PrimitiveAttrPaths<ATTRIBUTE>
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

export type Paths<SCHEMA extends Schema | Attribute = Schema | Attribute> = SCHEMA extends Schema
  ? SchemaPaths<SCHEMA>
  : SCHEMA extends Attribute
  ? AttrPaths<SCHEMA>
  : never
