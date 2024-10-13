import type { Call } from 'hotscript'

import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  MapAttribute,
  NullAttribute,
  NumberAttribute,
  PrimitiveAttribute,
  RecordAttribute,
  ResolveBinaryAttribute,
  ResolveBooleanAttribute,
  ResolveNumberAttribute,
  ResolvePrimitiveAttribute,
  ResolveStringAttribute,
  ResolvedNullAttribute,
  ResolvedPrimitiveAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Transformer, TypeModifier } from '~/transformers/index.js'
import type { Extends, If, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type TransformedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaTransformedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrTransformedValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = OPTIONS extends { defined: true }
  ? true
  : OPTIONS extends { mode: 'update' | 'key' }
    ? Extends<ATTRIBUTE, { required: Always }>
    : Extends<ATTRIBUTE, { required: AtLeastOnce | Always }>

type OptionalKeys<SCHEMA extends Schema | MapAttribute, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    SCHEMA['attributes'][KEY] extends { savedAs: string }
      ? // '& string' needed for old TS versions
        SCHEMA['attributes'][KEY]['savedAs'] & string
      : KEY
  >
}[keyof SCHEMA['attributes']]

type SchemaTransformedValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrTransformedValue<Attribute, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY] extends { savedAs: string }
          ? SCHEMA['attributes'][KEY]['savedAs']
          : KEY]: AttrTransformedValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, OPTIONS>
    >

type AttrTransformedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveAttribute
          ? PrimitiveAttrTransformedValue<ATTRIBUTE, OPTIONS>
          : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapAttribute ? MapAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrTransformedValue<ATTRIBUTE, OPTIONS> : never)

type AnyAttrTransformedValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ATTRIBUTE['castAs']

type PrimitiveAttrTransformedValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveAttribute
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | (ATTRIBUTE extends { transform: Transformer }
          ?
              | (ATTRIBUTE extends NullAttribute ? ResolvedNullAttribute : never)
              | (ATTRIBUTE extends NumberAttribute
                  ? ATTRIBUTE extends { transform: Transformer }
                    ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveNumberAttribute<ATTRIBUTE>>
                    : ResolveNumberAttribute<ATTRIBUTE>
                  : never)
              | (ATTRIBUTE extends BooleanAttribute
                  ? ATTRIBUTE extends { transform: Transformer }
                    ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveBooleanAttribute<ATTRIBUTE>>
                    : ResolveBooleanAttribute<ATTRIBUTE>
                  : never)
              | (ATTRIBUTE extends StringAttribute
                  ? ATTRIBUTE extends { transform: Transformer }
                    ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveStringAttribute<ATTRIBUTE>>
                    : ResolveStringAttribute<ATTRIBUTE>
                  : never)
              | (ATTRIBUTE extends BinaryAttribute
                  ? ATTRIBUTE extends { transform: Transformer }
                    ? Call<TypeModifier<ATTRIBUTE['transform']>, ResolveBinaryAttribute<ATTRIBUTE>>
                    : ResolveBinaryAttribute<ATTRIBUTE>
                  : never)
          : ResolvePrimitiveAttribute<ATTRIBUTE>)

type SetAttrTransformedValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends WriteValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrTransformedValue<
            SetAttribute['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrTransformedValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >

type ListAttrTransformedValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends WriteValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrTransformedValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapAttrTransformedValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends WriteValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes'] as ATTRIBUTE['attributes'][KEY] extends {
              savedAs: string
            }
              ? ATTRIBUTE['attributes'][KEY]['savedAs']
              : KEY]: AttrTransformedValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, OPTIONS>
        >

type RecordAttrTransformedValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrTransformedValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | {
          [KEY in KEYS]?: AttrTransformedValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfAttrTransformedValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AnyOfAttrTransformedValueRec<ATTRIBUTE['elements'], OPTIONS>

type AnyOfAttrTransformedValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends Attribute
    ? ELEMENTS_TAIL extends Attribute[]
      ? AnyOfAttrTransformedValueRec<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrTransformedValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
