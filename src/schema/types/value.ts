import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  ExtendedValue,
  Extension,
  ListAttribute,
  MapAttribute,
  Never,
  PrimitiveAttribute,
  RecordAttribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  SetAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type {
  Extends,
  If,
  OptionalizeUndefinableProperties,
  Overwrite,
  SelectKeys
} from '~/types/index.js'

import type { ParsingMode } from './mode.js'

interface ValueOptions {
  mode?: ParsingMode
  extension?: Extension
}

export type Value<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrValue<SCHEMA, OPTIONS>
    : never

type SchemaValue<SCHEMA extends Schema, OPTIONS extends ValueOptions> = Schema extends SCHEMA
  ? { [KEY: string]: AttrValue<Attribute, OPTIONS> }
  : OptionalizeUndefinableProperties<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes']]: AttrValue<SCHEMA['attributes'][KEY], OPTIONS>
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >

type AttrValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ValueOptions = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? PrimitiveAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapAttribute ? MapAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrValue<ATTRIBUTE, OPTIONS> : never)

type MustBeDefined<ATTRIBUTE extends Attribute, OPTIONS extends ValueOptions> = OPTIONS extends {
  mode: 'update' | 'key'
}
  ? Extends<ATTRIBUTE, { required: Always }>
  : Extends<ATTRIBUTE, { required: AtLeastOnce | Always }>

type AttrExtendedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], ATTRIBUTE['type']>
  : never

type AnyAttrValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends ValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | ATTRIBUTE['castAs']

type PrimitiveAttrValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends ValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | ResolvedPrimitiveAttribute | AttrExtendedValue<ATTRIBUTE, OPTIONS>
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveAttribute<ATTRIBUTE>

type SetAttrValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends ValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ? Set<AttrValue<SetAttribute['elements'], Overwrite<OPTIONS, { mode: 'put' }>>>
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | Set<AttrValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put' }>>>

type ListAttrValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends ValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? undefined | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | AttrValue<ATTRIBUTE['elements'], OPTIONS>[]

type MapAttrValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends ValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | OptionalizeUndefinableProperties<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes']]: AttrValue<ATTRIBUTE['attributes'][KEY], OPTIONS>
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
        >

type RecordAttrValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends ValueOptions = {},
  KEYS extends string = Extract<AttrValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | { [KEY in KEYS]?: AttrValue<ATTRIBUTE['elements'], OPTIONS> }

type AnyOfAttrValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends ValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedValue<ATTRIBUTE, OPTIONS>
      | AnyOfAttrValueRec<ATTRIBUTE['elements'], OPTIONS>

type AnyOfAttrValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends ValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrValueRec<ELEMENTS_TAIL, OPTIONS, RESULTS | AttrValue<ELEMENTS_HEAD, OPTIONS>>
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
