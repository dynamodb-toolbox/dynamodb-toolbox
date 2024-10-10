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
  ResolveStringAttribute,
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

interface InputValueOptions {
  mode?: ParsingMode
  extension?: Extension
  defined?: boolean
}

export type InputValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends InputValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaInputValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrInputValue<SCHEMA, OPTIONS>
    : never

type SchemaInputValue<
  SCHEMA extends Schema,
  OPTIONS extends InputValueOptions = {}
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrInputValue<Attribute, Overwrite<OPTIONS, { defined: false }>> }
  : OptionalizeUndefinableProperties<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes']]: AttrInputValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >

type AttrInputValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends InputValueOptions = {}
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

type MustBeProvided<
  ATTRIBUTE extends Attribute,
  OPTIONS extends InputValueOptions = {}
> = OPTIONS extends { defined: true }
  ? true
  : OPTIONS extends { mode: 'update' | 'key' }
    ? Extends<
        ATTRIBUTE,
        { required: Always } & (
          | { key: true; defaults: { key: undefined }; links: { key: undefined } }
          | { key: false; defaults: { update: undefined }; links: { update: undefined } }
        )
      >
    : Extends<
        ATTRIBUTE,
        { required: AtLeastOnce | Always } & (
          | { key: true; defaults: { key: undefined }; links: { key: undefined } }
          | { key: false; defaults: { put: undefined }; links: { put: undefined } }
        )
      >

type AttrExtendedInputValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends InputValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], ATTRIBUTE['type']>
  : never

type AnyAttrInputValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends InputValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedInputValue<ATTRIBUTE, OPTIONS> | unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | ATTRIBUTE['castAs']

type PrimitiveAttrInputValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends InputValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | ResolvedPrimitiveAttribute | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | ResolvePrimitiveAttribute<ATTRIBUTE>

type SetAttrInputValue<
  ATTRIBUTE extends SetAttribute,
  OPTIONS extends InputValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ?
      | undefined
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | Set<AttrInputValue<SetAttribute['elements'], Overwrite<OPTIONS, { mode: 'put' }>>>
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put'; defined: false }>>
        >

type ListAttrInputValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends InputValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedInputValue<ATTRIBUTE, OPTIONS> | unknown[]
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapAttrInputValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends InputValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedInputValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | OptionalizeUndefinableProperties<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes'] & string]: AttrInputValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
        >

type RecordAttrInputValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends InputValueOptions = {}
> = RecordAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedInputValue<ATTRIBUTE, OPTIONS> | { [KEY: string]: unknown }
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | {
          [KEY in ResolveStringAttribute<ATTRIBUTE['keys']>]?: AttrInputValue<
            ATTRIBUTE['elements'],
            Overwrite<OPTIONS, { defined: false }>
          >
        }

type AnyOfAttrInputValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends InputValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedInputValue<ATTRIBUTE, OPTIONS> | unknown
  :
      | If<MustBeProvided<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedInputValue<ATTRIBUTE, OPTIONS>
      | AttrInputValue<ATTRIBUTE['elements'][number], OPTIONS>
