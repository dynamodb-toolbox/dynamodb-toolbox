import type { Call } from 'hotscript'

import type {
  Always,
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  BinarySchema,
  BooleanSchema,
  ItemSchema,
  ListSchema,
  MapSchema,
  Never,
  NullSchema,
  NumberSchema,
  PrimitiveSchema,
  RecordSchema,
  ResolveAnySchema,
  ResolveBinarySchema,
  ResolveBooleanSchema,
  ResolveNumberSchema,
  ResolveStringSchema,
  ResolvedNullSchema,
  ResolvedPrimitiveSchema,
  SetSchema,
  StringSchema
} from '~/attributes/index.js'
import type { Transformer, TypeModifier } from '~/transformers/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type TransformedValue<
  SCHEMA extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends ItemSchema
  ? ItemSchemaTransformedValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrTransformedValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends AttrSchema, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    Extends<ATTRIBUTE['props'], { required: Always }>,
    Not<Extends<ATTRIBUTE['props'], { required: Never }>>
  >
>

type OptionalKeys<SCHEMA extends MapSchema | ItemSchema, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    SCHEMA['attributes'][KEY] extends { props: { savedAs: string } }
      ? // '& string' needed for old TS versions
        SCHEMA['attributes'][KEY]['props']['savedAs'] & string
      : KEY
  >
}[keyof SCHEMA['attributes']]

type ItemSchemaTransformedValue<
  SCHEMA extends ItemSchema,
  OPTIONS extends WriteValueOptions = {}
> = ItemSchema extends SCHEMA
  ? { [KEY: string]: AttrTransformedValue<AttrSchema, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { props: { key: true } }>
          : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY]['props'] extends {
          savedAs: string
        }
          ? SCHEMA['attributes'][KEY]['props']['savedAs']
          : KEY]: AttrTransformedValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, Overwrite<OPTIONS, { defined: false }>>
    >

type AttrTransformedValue<
  ATTRIBUTE extends AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = AttrSchema extends ATTRIBUTE
  ? unknown
  :
      | (ATTRIBUTE extends AnySchema ? AnySchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends PrimitiveSchema
          ? PrimitiveSchemaTransformedValue<ATTRIBUTE, OPTIONS>
          : never)
      | (ATTRIBUTE extends SetSchema ? SetSchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends ListSchema ? ListSchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends MapSchema ? MapSchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends RecordSchema ? RecordSchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)
      | (ATTRIBUTE extends AnyOfSchema ? AnyOfSchemaTransformedValue<ATTRIBUTE, OPTIONS> : never)

type AnySchemaTransformedValue<
  ATTRIBUTE extends AnySchema,
  OPTIONS extends WriteValueOptions = {}
> = AnySchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | (ATTRIBUTE['props'] extends { transform: Transformer }
          ? Call<TypeModifier<ATTRIBUTE['props']['transform']>, ResolveAnySchema<ATTRIBUTE>>
          : ResolveAnySchema<ATTRIBUTE>)

type PrimitiveSchemaTransformedValue<
  ATTRIBUTE extends PrimitiveSchema,
  OPTIONS extends WriteValueOptions = {}
> = PrimitiveSchema extends ATTRIBUTE
  ? undefined | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS> | ResolvedPrimitiveSchema
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | (ATTRIBUTE extends NullSchema ? ResolvedNullSchema : never)
      | (ATTRIBUTE extends NumberSchema
          ? ATTRIBUTE['props'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['props']['transform']>, ResolveNumberSchema<ATTRIBUTE>>
            : ResolveNumberSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BooleanSchema
          ? ATTRIBUTE['props'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['props']['transform']>, ResolveBooleanSchema<ATTRIBUTE>>
            : ResolveBooleanSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends StringSchema
          ? ATTRIBUTE['props'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['props']['transform']>, ResolveStringSchema<ATTRIBUTE>>
            : ResolveStringSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BinarySchema
          ? ATTRIBUTE['props'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['props']['transform']>, ResolveBinarySchema<ATTRIBUTE>>
            : ResolveBinarySchema<ATTRIBUTE>
          : never)

type SetSchemaTransformedValue<
  ATTRIBUTE extends SetSchema,
  OPTIONS extends WriteValueOptions = {}
> = SetSchema extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | Set<
          AttrTransformedValue<
            SetSchema['elements'],
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

type ListSchemaTransformedValue<
  ATTRIBUTE extends ListSchema,
  OPTIONS extends WriteValueOptions = {}
> = ListSchema extends ATTRIBUTE
  ?
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | unknown[]
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | AttrTransformedValue<ATTRIBUTE['elements'], Overwrite<OPTIONS, { defined: false }>>[]

type MapSchemaTransformedValue<
  ATTRIBUTE extends MapSchema,
  OPTIONS extends WriteValueOptions = {}
> = MapSchema extends ATTRIBUTE
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
              ? SelectKeys<ATTRIBUTE['attributes'], { props: { key: true } }>
              : keyof ATTRIBUTE['attributes'] as ATTRIBUTE['attributes'][KEY]['props'] extends {
              savedAs: string
            }
              ? ATTRIBUTE['attributes'][KEY]['props']['savedAs']
              : KEY]: AttrTransformedValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, Overwrite<OPTIONS, { defined: false }>>
        >

type RecordSchemaTransformedValue<
  ATTRIBUTE extends RecordSchema,
  OPTIONS extends WriteValueOptions = {},
  KEYS extends string = Extract<AttrTransformedValue<ATTRIBUTE['keys'], OPTIONS>, string>
> = RecordSchema extends ATTRIBUTE
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

type AnyOfSchemaTransformedValue<
  ATTRIBUTE extends AnyOfSchema,
  OPTIONS extends WriteValueOptions = {}
> = AnyOfSchema extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | AttrExtendedWriteValue<ATTRIBUTE, OPTIONS>
      | MapAnyOfSchemaTransformedValue<ATTRIBUTE['elements'], OPTIONS>

type MapAnyOfSchemaTransformedValue<
  ELEMENTS extends AttrSchema[],
  OPTIONS extends WriteValueOptions = {},
  RESULTS = never
> = ELEMENTS extends [infer ELEMENTS_HEAD, ...infer ELEMENTS_TAIL]
  ? ELEMENTS_HEAD extends AttrSchema
    ? ELEMENTS_TAIL extends AttrSchema[]
      ? MapAnyOfSchemaTransformedValue<
          ELEMENTS_TAIL,
          OPTIONS,
          RESULTS | AttrTransformedValue<ELEMENTS_HEAD, OPTIONS>
        >
      : never
    : never
  : [RESULTS] extends [never]
    ? unknown
    : RESULTS
