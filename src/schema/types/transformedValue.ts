import type { Call } from 'hotscript'

import type {
  Always,
  AnyAttribute,
  AnyOfAttribute,
  AtLeastOnce,
  Attribute,
  BinaryAttribute,
  BooleanAttribute,
  ExtendedValue,
  Extension,
  ListAttribute,
  MapAttribute,
  Never,
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
import type {
  Extends,
  If,
  OptionalizeUndefinableProperties,
  Overwrite,
  SelectKeys
} from '~/types/index.js'

import type { ParsingMode } from './mode.js'

interface TransformedValueOptions {
  mode?: ParsingMode
  extension?: Extension
}

export type TransformedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends TransformedValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaTransformedValue<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
    ? AttrTransformedValue<SCHEMA, OPTIONS>
    : never

type SchemaTransformedValue<
  SCHEMA extends Schema,
  OPTIONS extends TransformedValueOptions = {}
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrTransformedValue<Attribute, OPTIONS> }
  : OptionalizeUndefinableProperties<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY] extends { savedAs: string }
          ? SCHEMA['attributes'][KEY]['savedAs']
          : KEY]: AttrTransformedValue<SCHEMA['attributes'][KEY], OPTIONS>
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >

type AttrTransformedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends TransformedValueOptions = {}
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

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends TransformedValueOptions = {}
> = OPTIONS extends { mode: 'update' | 'key' }
  ? Extends<ATTRIBUTE, { required: Always }>
  : Extends<ATTRIBUTE, { required: AtLeastOnce | Always }>

type AttrExtendedTransformedValue<
  ATTRIBUTE extends Attribute,
  OPTIONS extends TransformedValueOptions = {}
> = OPTIONS extends { extension: Extension }
  ? ExtendedValue<OPTIONS['extension'], ATTRIBUTE['type']>
  : never

type AnyAttrTransformedValue<
  ATTRIBUTE extends AnyAttribute,
  OPTIONS extends TransformedValueOptions = {}
> = AnyAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      | ATTRIBUTE['castAs']

type PrimitiveAttrTransformedValue<
  ATTRIBUTE extends PrimitiveAttribute,
  OPTIONS extends TransformedValueOptions = {}
> = PrimitiveAttribute extends ATTRIBUTE
  ? undefined | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveAttribute
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
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
  OPTIONS extends TransformedValueOptions = {}
> = SetAttribute extends ATTRIBUTE
  ? Set<AttrTransformedValue<SetAttribute['elements'], Overwrite<OPTIONS, { mode: 'put' }>>>
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      | Set<AttrTransformedValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { mode: 'put' }>>>

type ListAttrTransformedValue<
  ATTRIBUTE extends ListAttribute,
  OPTIONS extends TransformedValueOptions = {}
> = ListAttribute extends ATTRIBUTE
  ? unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      | AttrTransformedValue<ATTRIBUTE['elements'], OPTIONS>[]

type MapAttrTransformedValue<
  ATTRIBUTE extends MapAttribute,
  OPTIONS extends TransformedValueOptions = {}
> = MapAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      | OptionalizeUndefinableProperties<
          {
            [KEY in OPTIONS extends { mode: 'key' }
              ? SelectKeys<ATTRIBUTE['attributes'], { key: true }>
              : keyof ATTRIBUTE['attributes'] & string as ATTRIBUTE['attributes'][KEY] extends {
              savedAs: string
            }
              ? ATTRIBUTE['attributes'][KEY]['savedAs']
              : KEY]: AttrTransformedValue<ATTRIBUTE['attributes'][KEY], OPTIONS>
          },
          // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
          SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
        >

type RecordAttrTransformedValue<
  ATTRIBUTE extends RecordAttribute,
  OPTIONS extends TransformedValueOptions = {},
  KEYS extends string = Extract<AttrTransformedValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordAttribute extends ATTRIBUTE
  ? { [KEY: string]: unknown }
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      // We cannot use Record type as it messes up map resolution down the line
      | { [KEY in KEYS]?: AttrTransformedValue<ATTRIBUTE['elements'], OPTIONS> }

type AnyOfAttrTransformedValue<
  ATTRIBUTE extends AnyOfAttribute,
  OPTIONS extends TransformedValueOptions = {}
> = AnyOfAttribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedTransformedValue<ATTRIBUTE, OPTIONS>
      | AnyOfAttrTransformedValueRec<ATTRIBUTE['elements'], OPTIONS>

type AnyOfAttrTransformedValueRec<
  ELEMENTS extends Attribute[],
  OPTIONS extends TransformedValueOptions = {},
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
