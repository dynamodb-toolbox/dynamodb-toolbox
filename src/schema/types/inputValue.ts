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
  ResolveStringAttribute,
  ResolvedPrimitiveAttribute,
  SetAttribute
} from '~/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type InputValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaInputValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrInputValue<SCHEMA, OPTIONS>
    : never

type MustBeProvided<ATTRIBUTE extends Attribute, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    If<
      Not<Extends<ATTRIBUTE['state'], { required: Always }>>,
      false,
      If<
        Extends<ATTRIBUTE['state'], { key: true }>,
        Not<Extends<ATTRIBUTE['state'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<ATTRIBUTE['state'], { updateDefault: unknown } | { updateLink: unknown }>>
      >
    >,
    If<
      Extends<ATTRIBUTE['state'], { required: Never }>,
      false,
      If<
        Extends<ATTRIBUTE['state'], { key: true }>,
        Not<Extends<ATTRIBUTE['state'], { keyDefault: unknown } | { keyLink: unknown }>>,
        Not<Extends<ATTRIBUTE['state'], { putDefault: unknown } | { putLink: unknown }>>
      >
    >
  >
>

type OptionalKeys<SCHEMA extends Schema | MapAttribute, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeProvided<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    KEY
  >
}[keyof SCHEMA['attributes']]

type SchemaInputValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrInputValue<Attribute, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { state: { key: true } }>
          : keyof SCHEMA['attributes']]: AttrInputValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, OPTIONS>
    >

type AttrInputValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends WriteValueOptions = {}
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnyAttribute ? AnyAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveAttribute ? PrimitiveAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends SetAttribute ? SetAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListAttribute ? ListAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapAttribute ? MapAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordAttribute ? RecordAttrInputValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfAttribute ? AnyOfAttrInputValue<ATTRIBUTE, OPTIONS> : never)

type AnyAttrInputValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolveAnyAttribute<ATTRIBUTE>

type PrimitiveAttrInputValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | ResolvedPrimitiveAttribute | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveAttribute<ATTRIBUTE>

type SetAttrInputValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends WriteValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrInputValue<
            SetAttribute['elements'],
            Overwrite<OPTIONS, { mode: 'put'; defined: false }>
          >
        >
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListAttrInputValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends WriteValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapAttrInputValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends WriteValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Optional<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { state: { key: true } }>
              : keyof ATTRIBUTE['attributes']]: AttrInputValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, OPTIONS>
        >

type RecordAttrInputValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends WriteValueOptions = {}
> = RecordAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | {
          [KEY in ResolveStringAttribute<ATTRIBUTE['keys']>]?: AttrInputValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfAttrInputValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'][number], OPTIONS>
