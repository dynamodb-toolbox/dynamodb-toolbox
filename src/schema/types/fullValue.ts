import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  ListAttribute,
  MapAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  SetAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Extends, If, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type FullValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaFullValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrFullValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions
> = OPTIONS extends { defined: true }
  ? true
  : OPTIONS extends { mode: 'update' | 'key' }
    ? Extends<ATTRIBUTE, { required: Always }>
    : Extends<ATTRIBUTE, { required: AtLeastOnce | Always }>

type OptionalKeys<SCHEMA extends Schema | MapAttribute, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type SchemaFullValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrFullValue<Attribute, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes']]: AttrFullValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, OPTIONS>
    >

type AttrFullValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? PrimitiveAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapAttribute ? MapAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrFullValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrFullValue<ATTRIBUTE, OPTIONS> : never)

type AnyAttrFullValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ATTRIBUTE['castAs']

type PrimitiveAttrFullValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveAttribute
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveAttribute<ATTRIBUTE>

type SetAttrFullValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends WriteValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrFullValue<
            SetAttribute['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrFullValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListAttrFullValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends WriteValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrFullValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapAttrFullValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends WriteValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes']]: AttrFullValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, OPTIONS>
        >

type RecordAttrFullValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrFullValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | {
          [KEY in KEYS]?: AttrFullValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfAttrFullValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AnyOfAttrFullValueRec<ATTRIBUTE['elements'], OPTIONS>

type AnyOfAttrFullValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrFullValueRec<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrFullValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
