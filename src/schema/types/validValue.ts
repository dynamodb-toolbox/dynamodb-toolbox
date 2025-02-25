import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  Attribute,
  ListAttribute,
  MapAttribute,
  Never,
  PrimitiveAttribute,
  RecordAttribute,
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute,
  ResolvedPrimitiveAttribute,
  SetAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type ValidValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaValidValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrValidValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends Attribute, OPTIONS extends WriteValueOptions> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    Extends<ATTRIBUTE['state'], { required: Always }>,
    Not<Extends<ATTRIBUTE['state'], { required: Never }>>
  >
>

type OptionalKeys<SCHEMA extends Schema | MapAttribute, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type SchemaValidValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrValidValue<Attribute, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { state: { key: true } }>
          : keyof SCHEMA['attributes']]: AttrValidValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, OPTIONS>
    >

type AttrValidValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? PrimitiveAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapAttribute ? MapAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrValidValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrValidValue<ATTRIBUTE, OPTIONS> : never)

type AnyAttrValidValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolveAnyAttribute<ATTRIBUTE>

type PrimitiveAttrValidValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveAttribute
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveAttribute<ATTRIBUTE>

type SetAttrValidValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends WriteValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrValidValue<
            SetAttribute['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrValidValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListAttrValidValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends WriteValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrValidValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapAttrValidValue<
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
              ? SelectKeys<ATTRIBUTE['attributes'], { state: { key: true } }>
              : keyof ATTRIBUTE['attributes']]: AttrValidValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, OPTIONS>
        >

type RecordAttrValidValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrValidValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | {
          [KEY in KEYS]?: AttrValidValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfAttrValidValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AnyOfAttrValidValueRec<ATTRIBUTE['elements'], OPTIONS>

type AnyOfAttrValidValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrValidValueRec<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrValidValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
