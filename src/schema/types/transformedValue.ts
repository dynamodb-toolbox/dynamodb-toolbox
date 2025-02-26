import type { Call } from 'hotscript'

import type {
  Always,
  AnyOfSchema,
  AnySchema,
  AttrSchema,
  BinarySchema,
  BooleanSchema,
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
import type { Schema } from '~/schema/index.js'
import type { Transformer, TypeModifier } from '~/transformers/index.js'
import type { Extends, If, Not, Optional, Overwrite, SelectKeys } from '~/types/index.js'

import type { AttrExtendedWriteValue, WriteValueOptions } from './options.js'

export type TransformedValue<
  SCHEMA extends Schema | AttrSchema,
  OPTIONS extends WriteValueOptions = {}
> = SCHEMA extends Schema
  ? SchemaTransformedValue<SCHEMA, OPTIONS>
  : SCHEMA extends AttrSchema
    ? AttrTransformedValue<SCHEMA, OPTIONS>
    : never

type MustBeDefined<ATTRIBUTE extends AttrSchema, OPTIONS extends WriteValueOptions = {}> = If<
  Extends<OPTIONS, { defined: true }>,
  true,
  If<
    Extends<OPTIONS, { mode: 'update' | 'key' }>,
    Extends<ATTRIBUTE['state'], { required: Always }>,
    Not<Extends<ATTRIBUTE['state'], { required: Never }>>
  >
>

type OptionalKeys<SCHEMA extends Schema | MapSchema, OPTIONS extends WriteValueOptions = {}> = {
  [KEY in keyof SCHEMA['attributes']]: If<
    MustBeDefined<SCHEMA['attributes'][KEY], OPTIONS>,
    never,
    SCHEMA['attributes'][KEY] extends { state: { savedAs: string } }
      ? // '& string' needed for old TS versions
        SCHEMA['attributes'][KEY]['state']['savedAs'] & string
      : KEY
  >
}[keyof SCHEMA['attributes']]

type SchemaTransformedValue<
  SCHEMA extends Schema,
  OPTIONS extends WriteValueOptions = {}
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrTransformedValue<AttrSchema, Overwrite<OPTIONS, { defined: false }>> }
  : Optional<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? SelectKeys<SCHEMA['attributes'], { state: { key: true } }>
          : keyof SCHEMA['attributes'] as SCHEMA['attributes'][KEY]['state'] extends {
          savedAs: string
        }
          ? SCHEMA['attributes'][KEY]['state']['savedAs']
          : KEY]: AttrTransformedValue<
          SCHEMA['attributes'][KEY],
          Overwrite<OPTIONS, { defined: false }>
        >
      },
      OptionalKeys<SCHEMA, OPTIONS>
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
      | (ATTRIBUTE['state'] extends { transform: Transformer }
          ? Call<TypeModifier<ATTRIBUTE['state']['transform']>, ResolveAnySchema<ATTRIBUTE>>
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
          ? ATTRIBUTE['state'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['state']['transform']>, ResolveNumberSchema<ATTRIBUTE>>
            : ResolveNumberSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BooleanSchema
          ? ATTRIBUTE['state'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['state']['transform']>, ResolveBooleanSchema<ATTRIBUTE>>
            : ResolveBooleanSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends StringSchema
          ? ATTRIBUTE['state'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['state']['transform']>, ResolveStringSchema<ATTRIBUTE>>
            : ResolveStringSchema<ATTRIBUTE>
          : never)
      | (ATTRIBUTE extends BinarySchema
          ? ATTRIBUTE['state'] extends { transform: Transformer }
            ? Call<TypeModifier<ATTRIBUTE['state']['transform']>, ResolveBinarySchema<ATTRIBUTE>>
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
              ? SelectKeys<ATTRIBUTE['attributes'], { state: { key: true } }>
              : keyof ATTRIBUTE['attributes'] as ATTRIBUTE['attributes'][KEY]['state'] extends {
              savedAs: string
            }
              ? ATTRIBUTE['attributes'][KEY]['state']['savedAs']
              : KEY]: AttrTransformedValue<
              ATTRIBUTE['attributes'][KEY],
              Overwrite<OPTIONS, { defined: false }>
            >
          },
          OptionalKeys<ATTRIBUTE, OPTIONS>
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
